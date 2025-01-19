using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using WootingAnalogSDKNET;
using NeatInput.Windows;
using NeatInput.Windows.Events;
using System.Globalization;
using SharpDX.XInput;
using System.Diagnostics;


namespace Woot_verlay
{
    internal static class Program
    {
        // global variables
        private static bool runSystem = true;
        private static bool runNonwooting = false;
        private static bool openToLan;
        private static List<TcpClient> activeConnections = new List<TcpClient>();

        /// <summary>
        ///  The entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {   
            // initialise application
            ApplicationConfiguration.Initialize();
            Application.EnableVisualStyles();
            Application.SetHighDpiMode(HighDpiMode.DpiUnaware);
            Application.SetCompatibleTextRenderingDefault(false);
            SetCulture(CultureInfo.CurrentCulture.Name);

            // Check for Wooting compatibility
            // Load WootingAnalogSDK
            var (numDevices, error) = WootingAnalogSDK.Initialise();

            // Show configuration window
            var configForm = new SetupForm(numDevices < 0);
            if (configForm.ShowDialog() != DialogResult.OK)
            {
                // User closed the window or cancelled
                Environment.Exit(1);
            }

            // Get user selections
            runNonwooting = configForm.UseNonWooting;
            openToLan = configForm.EnableLanMode;
            string ip = openToLan ? "0.0.0.0" : "127.0.0.1";

            if (configForm.EnableLanMode)
            {
                MessageBox.Show(Properties.Resources.ConfigForm_LanInfo,
                    "Info",
                    MessageBoxButtons.OK);
            }

            // initialise server
            int port = 32312;
            var server = new TcpListener(IPAddress.Parse(ip), port);
            try{
                server.Start();
            }
            catch (Exception) {
                MessageBox.Show(Properties.Resources.ConfigForm_ServerError, "Woot-verlay - already running error");
                System.Environment.Exit(1);
            }

            // run client handler and main program loop
            // create keyboard hooks and listen for input
            var keyboardReceiver = new KeyListener();
            var inputSource = new InputSource(keyboardReceiver);
            inputSource.Listen();

            ThreadPool.QueueUserWorkItem(o => handleClients(server));
            ThreadPool.QueueUserWorkItem(o => runLoop(keyboardReceiver));

            // start application in the tray
            Application.Run(new WootTrayApp());
        }


        /// <summary>
        /// Sends a correctly structured message to a JavaSript websocket
        /// </summary>
        private static bool sendMessage(TcpClient client, string inputText)
        {
            if(!client.Connected) return false;
            NetworkStream stream = client.GetStream();

            byte[] sendBytes = Encoding.UTF8.GetBytes(inputText);
            byte lengthHeader = 0;
            byte[] lengthCount = new byte[] { };

            if (sendBytes.Length <= 125)
                lengthHeader = (byte)sendBytes.Length;
            if (125 < sendBytes.Length && sendBytes.Length < 65535) //System.UInt16
            {
                lengthHeader = 126;

                lengthCount = new byte[] {
                    (byte)(sendBytes.Length >> 8),
                    (byte)(sendBytes.Length)
                };
            }

            if (sendBytes.Length > 65535)//max 2_147_483_647 but .Length -> System.Int32
            {
                lengthHeader = 127;
                lengthCount = new byte[] {
                    (byte)(sendBytes.Length >> 56),
                    (byte)(sendBytes.Length >> 48),
                    (byte)(sendBytes.Length >> 40),
                    (byte)(sendBytes.Length >> 32),
                    (byte)(sendBytes.Length >> 24),
                    (byte)(sendBytes.Length >> 16),
                    (byte)(sendBytes.Length >> 8),
                    (byte)sendBytes.Length,
                };
            }

            List<byte> responseArray = new List<byte>() { 0b10000001 };

            responseArray.Add(lengthHeader);
            responseArray.AddRange(lengthCount);
            responseArray.AddRange(sendBytes);

            try {
                stream.Write(responseArray.ToArray(), 0, responseArray.Count);
            } catch (Exception) { return false; };
            
            return true;
        }


        private static string GetLocalIPAddress()
        {
            var host = Dns.GetHostEntry(Dns.GetHostName());
            foreach (var ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }
            throw new Exception("No network adapters with an IPv4 address in the system!");
        }

        /// <summary>
        /// Looping method to accept incoming connections
        /// </summary>
        private static void handleClients(TcpListener server)
        {
            while (runSystem)
            {
                // wait and listen for a new connection
                TcpClient client = server.AcceptTcpClient();
                NetworkStream stream = client.GetStream();
                bool hasHandshaked = false;

                // attempt client handshake
                while (!hasHandshaked && client.Connected)
                {
                    byte[] bytes = new byte[client.Available];
                    stream.Read(bytes, 0, client.Available);
                    string s = Encoding.UTF8.GetString(bytes);

                    // provide first link handshake
                    if (Regex.IsMatch(s, "^GET", RegexOptions.IgnoreCase))
                    {
                        //Console.WriteLine("=====Handshaking from client=====\n{0}==============================\n", s);
                        string swk = Regex.Match(s, "Sec-WebSocket-Key: (.*)").Groups[1].Value.Trim();
                        string swka = swk + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                        byte[] swkaSha1 = System.Security.Cryptography.SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(swka));
                        string swkaSha1Base64 = Convert.ToBase64String(swkaSha1);

                        // HTTP/1.1 defines the sequence CR LF as the end-of-line marker
                        byte[] response = Encoding.UTF8.GetBytes(
                            "HTTP/1.1 101 Switching Protocols\r\n" +
                            "Connection: Upgrade\r\n" +
                            "Upgrade: websocket\r\n" +
                            "Sec-WebSocket-Accept: " + swkaSha1Base64 + "\r\n\r\n");

                        stream.Write(response, 0, response.Length);
                        hasHandshaked = true;
                        activeConnections.Add(client);
                        Debug.WriteLine("Client connected, there are now " + activeConnections.Count() + " connection/s.");
                    }
                }
            }
        }


        /// <summary>
        /// Main program loop that reads Wooting SDK input and sends info to clients
        /// </summary>
        private static void runLoop(KeyListener keyboardReceiver) {
            // wooting setup
            List<TcpClient> disconnected = new List<TcpClient>();

            // non wooting setup
            var controller = new Controller(UserIndex.One);
            HashSet<int> controllerKeys = new HashSet<int>();
            StringBuilder contentBuilder = new StringBuilder();
            if (runNonwooting) Debug.WriteLine("Running non-wooting. Gamepad detected: " + controller.IsConnected);

            // run SDK loop for continuous update stream
            bool shownEmpty = false;
            while (runSystem)
            {
                // remove inactive clients
                //disconnected = activeConnections.FindAll(curClient => !curClient.Connected);
                if (disconnected.Count > 0)
                {
                    disconnected.ForEach(client => activeConnections.Remove(client));
                    Debug.WriteLine(disconnected.Count + " client/s disconnected. " + activeConnections.Count + " connections remaining.\n");
                }
                disconnected.Clear();
                
                contentBuilder.Clear();

                if (!runNonwooting)
                {
                    // read analog buffer and start sending keys
                    var (keys, readErr) = WootingAnalogSDK.ReadFullBuffer(20);
                    if (readErr == WootingAnalogResult.Ok)
                    {
                        // collect all key information
                        try
                        {
                            if (keys.Count > 0)
                            {
                                foreach (var analog in keys)
                                {
                                    var pressed = keyboardReceiver.activeKeys.Contains(analog.Item1) ? 1 : 0;
                                    contentBuilder.Append($"({analog.Item1}:{analog.Item2}:{pressed})");
                                }
                                // message info to client for display
                                shownEmpty = false;
                            }
                        }
                        catch (Exception) { Debug.WriteLine("Client unavailable - removing next loop."); }
                    }
                    else
                    {
                        //Console.WriteLine($"Read failed with {readErr}");
                        Thread.Sleep(1000);
                    }
                   
                }
                else {
                    // default and generic HE keyboards
                    try
                    {
                        if (controller.IsConnected) {
                            var state = controller.GetState();
                            // Get the joystick positions
                            var leftThumbX = state.Gamepad.LeftThumbX / 32767.0f; // Normalise to -1.0 to 1.0
                            var leftThumbY = state.Gamepad.LeftThumbY / 32767.0f;
                            var rightThumbX = state.Gamepad.RightThumbX / 32767.0f;
                            var rightThumbY = state.Gamepad.RightThumbY / 32767.0f;

                            UpdateJoystickAxis(leftThumbX, KeyListener.keyMaps.A, KeyListener.keyMaps.D, controllerKeys, contentBuilder);
                            UpdateJoystickAxis(leftThumbY, KeyListener.keyMaps.S, KeyListener.keyMaps.W, controllerKeys, contentBuilder);
                            UpdateJoystickAxis(rightThumbX, KeyListener.keyMaps.Left, KeyListener.keyMaps.Right, controllerKeys, contentBuilder);
                            UpdateJoystickAxis(rightThumbY, KeyListener.keyMaps.Down, KeyListener.keyMaps.Up, controllerKeys, contentBuilder);
                        }
                        foreach (var key in keyboardReceiver.activeKeys) {
                            if(controllerKeys.Contains(key)) continue;
                            contentBuilder.Append($"({key}:1:1)");
                        }
                        foreach (var key in keyboardReceiver.inActiveKeys)
                        {
                            contentBuilder.Append($"({key}:0:0)");
                        }
                        keyboardReceiver.inActiveKeys.Clear();
                        // message info to client for display
                        if(contentBuilder.Length > 0) shownEmpty = false;
                    }
                    catch (Exception) { Debug.WriteLine("Client unavailable - removing next loop."); }
                }

                // send data to clients
                if (contentBuilder.Length > 0 || !shownEmpty)
                {
                    activeConnections.ForEach(curClient =>
                    {
                        if (!sendMessage(curClient, contentBuilder.ToString()))
                        {
                            disconnected.Add(curClient);
                        }
                    });
                    if (contentBuilder.Length == 0) shownEmpty = true;
                }
  
                // control refresh speed
                Thread.Sleep(10);
            }
        }

        /// <summary>
        /// Converts joystick axis values to key presses for a pair of keys
        /// </summary>
        static void UpdateJoystickAxis(float axisValue, KeyListener.keyMaps negativeKey, KeyListener.keyMaps positiveKey, HashSet<int> controllerKeys, StringBuilder contentBuilder)
        {
            if (axisValue < 0)
            {
                controllerKeys.Add((int)negativeKey);
                contentBuilder.Append($"({(int)negativeKey}:{-axisValue}:1)");
                contentBuilder.Append($"({(int)positiveKey}:0:0)");
                controllerKeys.Remove((int)positiveKey);
            }
            else if (axisValue > 0)
            {
                controllerKeys.Add((int)positiveKey);
                contentBuilder.Append($"({(int)positiveKey}:{axisValue}:1)");
                contentBuilder.Append($"({(int)negativeKey}:0:0)");
                controllerKeys.Remove((int)negativeKey);
            }
            else {
                if (controllerKeys.Contains((int)positiveKey)){
                    contentBuilder.Append($"({(int)positiveKey}:0:0)");
                    controllerKeys.Remove((int)positiveKey);
                }
                if (controllerKeys.Contains((int)negativeKey))
                {
                    contentBuilder.Append($"({(int)negativeKey}:0:0)");
                    controllerKeys.Remove((int)negativeKey);
                };
            }
        }



        /// <summary>
        /// Allows language swapping through resource files
        /// </summary>
        private static void SetCulture(string cultureCode)
        {
            Thread.CurrentThread.CurrentUICulture = new CultureInfo(cultureCode);
        }

        /// <summary>
        /// Class <c>KeyListener</c> listens to key presses and stores active ones
        /// </summary>
        internal class KeyListener : IKeyboardEventReceiver
        {
            // convert key events to Wooting key numbers
            public enum keyMaps
            {
                A = 4, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, // Z = 29
                D1, D2, D3, D4, D5, D6, D7, D8, D9, D0, // 0 key is 39
                Return, Escape, Back, Tab, Space, OemMinus, OemPlus, Oemplus = 46, OemOpenBrackets, OemCloseBrackets, Oem6 = 48, Oem5, // 50 = non-US-1. 48 (OemCloseBrackets) swapped for oem6
                Oem1 = 51, Oem7, Oemtilde, Oemcomma, OemPeriod, OemQuestion, Capital,
                F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12,
                PrintScreen, Scroll, MediaPlayPause = 72, Pause = 72, Insert, Home, PageUp, Delete, End, PageDown,
                Right, Left, Down, Up, NumLock,
                Divide, Multiply, Subtract, Add, NumPad1 = 89, NumPad2, NumPad3, NumPad4, NumPad5, NumPad6, NumPad7, NumPad8, NumPad9, NumPad0, Decimal,
                Apps = 101,
                F13 = 104, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24,
                LControlKey = 224, LShiftKey, LMenu, LWin, RControlKey, RShiftKey, RMenu, RWin
            }

            // store active keys and inActive keys
            public List<int> activeKeys = new List<int>();
            public List<int> inActiveKeys = new List<int>();

            // listen key upstrokes and downstrokes
            public void Receive(KeyboardEvent @event)
            {
                keyMaps keyCode;
                keyMaps.TryParse(@event.Key.ToString(), out keyCode);
                //Debug.WriteLine("Input: " + @event.Key.ToString());
                if ((int)keyCode > 0)
                {
                    //Debug.WriteLine("Output: " + @event.Key.ToString() + " " + (int)keyCode);
                    if (@event.State == NeatInput.Windows.Processing.Keyboard.Enums.KeyStates.Up && activeKeys.Contains((int)keyCode))
                    { // remove key on upstroke
                        activeKeys.Remove((int)keyCode);
                        inActiveKeys.Add((int)keyCode);
                    }
                    else if (!activeKeys.Contains((int)keyCode))
                    { // add key on downstroke
                        activeKeys.Add((int)keyCode);
                    }
                }
            }
        }


        /// <summary>
        /// Class <c>WootTrayApp</c> is the main tray application
        /// </summary>
        internal class WootTrayApp : ApplicationContext
        {
            private NotifyIcon trayIcon;

            // constructor
            public WootTrayApp()
            {
                // set language
                SetCulture(CultureInfo.CurrentCulture.Name);

                // create menu strip with contents
                string ipMessage = openToLan
                ? string.Format(Properties.Resources.Tray_LanIP, GetLocalIPAddress())
                : Properties.Resources.Tray_LocalMode;

                    var strip = new ContextMenuStrip()
                    {
                        Items =
                {
                    new ToolStripMenuItem(ipMessage, null, null, ""),
                    new ToolStripMenuItem(Properties.Resources.Tray_StopOverlay, null, new EventHandler(Exit), "EXIT")
                }
                    };

                strip.BackColor = Color.FromArgb(255, 20, 21, 24);
                strip.ForeColor = Color.White;
                strip.RenderMode = ToolStripRenderMode.System;

                // create tray application with strip and icon
                trayIcon = new NotifyIcon()
                {
                    Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath),
                    ContextMenuStrip = strip,
                    Visible = true
                };
            }

            // exit button function
            void Exit(object? sender, EventArgs e)
            {
                // Hide tray icon, otherwise it will remain shown until user mouses over it
                trayIcon.Visible = false;
                Application.Exit();
            }
        }

    }


}


