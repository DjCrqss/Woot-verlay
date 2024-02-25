using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using WootingAnalogSDKNET;
using NeatInput.Windows;
using NeatInput.Windows.Events;


namespace Woot_verlay
{
    internal static class Program
    {
        // global variables
        private static bool runSystem = true;
        private static bool runNonwooting = false;
        private static DialogResult openToLan;
        private static List<TcpClient> activeConnections = new List<TcpClient>();


        /// <summary>
        ///  The entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {   
            // initialise application
            ApplicationConfiguration.Initialize();

            // load WootingAnalogSDK
            var (noDevices, error) = WootingAnalogSDK.Initialise();
            // print error if no Wooting devices found
            if (noDevices < 0)
            {
                if (MessageBox.Show("Wooting Analog SDK failed to initialise. \nPlease install Wootility or the SDK manually!\n\nWould you like to continue as a normal input overlay?", "Woot-verlay - no SDK error", MessageBoxButtons.OKCancel) == DialogResult.OK)
                {
                    runNonwooting = true;
                }
                else {
                    System.Environment.Exit(1);
                }
            }

            // create keyboard hooks and listen for input
            var keyboardReceiver = new KeyListener();
            var inputSource = new InputSource(keyboardReceiver);
            inputSource.Listen();

            // ask user if they want to run open to LAN or just this pc
            openToLan = MessageBox.Show("Do you want to use LAN mode? LAN means that you will be able to view your keypresses on other devices (useful for secondary pc streaming). Pressing NO (Default) will only allow the overlay to work on this device." , "Woot-verlay - Mode Selection", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
            string ip = "127.0.0.1";
            if(openToLan == DialogResult.Yes){
                ip = "0.0.0.0";
                MessageBox.Show("Right click Woot-verlay in your system tray see check your local IP address." + " Open Woot-verlay on another device and click the port tab in the toolbar.", "Info", MessageBoxButtons.OK);
            }

            // initialise server
            int port = 32312;
            var server = new TcpListener(IPAddress.Parse(ip), port);
            try{
                server.Start();
            }
            catch (Exception) {
                MessageBox.Show("Uh oh. Woot-verlay server cannot be started. \nPlease close already running Woot-verlays or server apps.", "Woot-verlay - already running error");
                System.Environment.Exit(1);
            }

            // run client handler and main program loop
            ThreadPool.QueueUserWorkItem(o => handleClients(server));
            ThreadPool.QueueUserWorkItem(o => runLoop(keyboardReceiver));

            // start application in the tray
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new WootTrayApp());
        }


        /// <summary>
        /// Sends a correctly structured message to a JavaSript websocket
        /// </summary>
        private static void sendMessage(NetworkStream stream, string inputText)
        {

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

            stream.Write(responseArray.ToArray(), 0, responseArray.Count);
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
                // listen for a new connection
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
                    }
                }
            }
        }


        /// <summary>
        /// Main program loop that reads Wooting SDK input and sends info to clients
        /// </summary>
        private static void runLoop(KeyListener keyboardReceiver) {
            // run SDK loop for continuous update stream
            bool shownEmpty = false;
            while (runSystem)
            {
                // remove inactive clients
                List<TcpClient> disconnected = activeConnections.FindAll(curClient => !curClient.Connected);
                if (disconnected.Count > 0)
                {
                    Console.WriteLine(disconnected.Count + " client/s disconnected. " + activeConnections.Count + " connections remaining.\n");
                    disconnected.ForEach(client => activeConnections.Remove(client));
                }

                if (!runNonwooting)
                {
                    // read analogue buffer and start sending keys
                    var (keys, readErr) = WootingAnalogSDK.ReadFullBuffer(20);
                    if (readErr == WootingAnalogResult.Ok)
                    {
                        // collect all key information
                        try
                        {
                            if (keys.Count > 0)
                            {
                                String content = "";
                                foreach (var analog in keys)
                                {
                                    var pressed = keyboardReceiver.activeKeys.Contains(analog.Item1) ? 1 : 0;
                                    content += "(" + analog.Item1 + ":" + analog.Item2 + ":" + pressed + ")";
                                }
                                // message info to client for display
                                activeConnections.ForEach(curClient => sendMessage(curClient.GetStream(), content));
                                shownEmpty = false;
                            }
                            else if (!shownEmpty)
                            {
                                // allow a single empty line after all keys are released
                                activeConnections.ForEach(curClient => sendMessage(curClient.GetStream(), ""));
                                shownEmpty = true;
                            }
                        }
                        catch (Exception) { Console.WriteLine("Client unavailable - removing next loop."); }
                    }
                    else
                    {
                        //Console.WriteLine($"Read failed with {readErr}");
                        Thread.Sleep(1000);
                    }
                   
                }
                else {
                    try
                    {
                        String content = "";
                        foreach (var key in keyboardReceiver.activeKeys) {
                            content += "(" + key + ":1:1)";
                        }
                        foreach (var key in keyboardReceiver.inActiveKeys)
                        {
                            content += "(" + key + ":0:0)";
                        }
                        keyboardReceiver.inActiveKeys.Clear();
                        // message info to client for display
                        activeConnections.ForEach(curClient => sendMessage(curClient.GetStream(), content));
                        shownEmpty = false;
                    }
                    catch (Exception) { Console.WriteLine("Client unavailable - removing next loop."); }
                }
                // control refresh speed
                Thread.Sleep(25);
            }
        }


        /// <summary>
        /// Class <c>KeyListener</c> listens to key presses and stores active ones
        /// </summary>
        internal class KeyListener : IKeyboardEventReceiver
        {
            // convert key events to Wooting key numbers
            enum keyMaps
            {
                A = 4, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, // Z = 29
                D1, D2, D3, D4, D5, D6, D7, D8, D9, D0, // 0 key is 39
                Return, Escape, Back, Tab, Space, OemMinus, OemPlus, OemOpenBrackets, OemCloseBrackets, Oem5, // 50 = non-US-1
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
                System.Diagnostics.Debug.WriteLine("Input: " + @event.GetHashCode);
                if ((int)keyCode > 0)
                {
                    Console.WriteLine("Output: " + @event.Key.ToString() + " " + (int)keyCode);
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
                // create menu strip with contents
                ToolStripMenuItem toolStripIpItem = new ToolStripMenuItem("Running local mode.", null, null, "");
                if (openToLan == DialogResult.Yes)
                {
                    string IP = GetLocalIPAddress();
                    toolStripIpItem = new ToolStripMenuItem("LAN IP: " + IP, null, null, "");
                }
                var strip = new ContextMenuStrip()
                {
                    Items =
                        {
                            toolStripIpItem,
                            new ToolStripMenuItem("Stop overlay", null, new EventHandler(Exit), "EXIT")

                        }
                };
                strip.BackColor = Color.FromArgb(255, 20, 21, 24); ;
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


