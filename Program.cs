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
        public static bool runSystem = true;
        public static List<TcpClient> activeConnections = new List<TcpClient>();


        /// <summary>
        ///  The entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
           
            
            // load WootingAnalogSDK
            var (noDevices, error) = WootingAnalogSDK.Initialise();
            // print error if no Wooting devices found
            if (noDevices < 0)
            {
                MessageBox.Show("It seems that there are no Wooting devices connected. \nPlease plug in your keyboard and try again!\nAnalog SDK failed to initialise: {error}", "Woot-verlay - no device error");
                System.Environment.Exit(1);
            }

            // create keyboard hooks and listen for input
            var keyboardReceiver = new KeyListener();
            var inputSource = new InputSource(keyboardReceiver);
            inputSource.Listen();

            // initialise server
            string ip = "127.0.0.1";
            int port = 80;
            var server = new TcpListener(IPAddress.Parse(ip), port);
            server.Start();
            //Console.WriteLine("\nServer has started on {0}:{1}, Waiting for a connection…\n", ip, port);

            // run client handler and main program loop
            ThreadPool.QueueUserWorkItem(o => handleClients(server));
            ThreadPool.QueueUserWorkItem(o => runLoop(keyboardReceiver));

            // start application
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new WootTrayApp());
        }


        /// <summary>
        /// Sends a message to a JavaSript websocket
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


        /// <summary>
        /// Looping method to accept incoming connections
        /// </summary>
        public static void handleClients(TcpListener server)
        {
            while (runSystem)
            {
                TcpClient client = server.AcceptTcpClient();
                NetworkStream stream = client.GetStream();

                bool hasHandshaked = false;
                // client information
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
                        //Console.WriteLine("Client " + activeConnections.Count + " connected.\n");
                    }
                }


            }
        }


        /// <summary>
        /// Main program loop that reads Wooting SDK input and sends info to clients
        /// </summary>
        public static void runLoop(KeyListener keyboardReceiver) {
            // run SDK loop
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

                // read analogue buffer and start sending keys
                var (keys, readErr) = WootingAnalogSDK.ReadFullBuffer(20);
                if (readErr == WootingAnalogResult.Ok) {
                    // collect all key information
                    try {
                        if (keys.Count > 0){
                            String content = "";
                            foreach (var analog in keys){
                                var pressed = (keyboardReceiver.activeKeys.Contains(analog.Item1)) ? 1 : 0;
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
                else {
                    //Console.WriteLine($"Read failed with {readErr}");
                    Thread.Sleep(1000);
                }
                Thread.Sleep(25);
            }
        }


        /// <summary>
        /// Class <c>KeyListener</c> listens to key presses and stores active ones
        /// </summary>
        internal class KeyListener : IKeyboardEventReceiver
        {
            // convert key events to wooting key numbers
            enum keyMaps
            {
                A = 4, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, // Z = 29
                D1, D2, D3, D4, D5, D6, D7, D8, D9, D0, // 0 key is 39
                Return, Escape, Back, Tab, Space, OemMinus, OemPlus, OemOpenBrackets, OemCloseBrackets, Oem5, // 50 = non-US-1
                Oem1 = 51, Oem7, Oemtilde, Oemcomma, OemPeriod, OemQuestion, Capital,
                F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12,
                PrintScreen, Scroll, MediaPlayPause, Insert, Home, PageUp, Delete, End, PageDown,
                Right, Left, Down, Up, NumLock, Apps = 101,
                LControlKey = 224, LShiftKey, LMenu, LWin, RControlKey, RShiftKey, RMenu, RWin
            }

            // store active keys
            public List<int> activeKeys = new List<int>();

            // listen key upstrokes and downstrokes
            public void Receive(KeyboardEvent @event)
            {
                // Console.WriteLine(@event.Key.ToString());

                var keyCode = keyMaps.Space;
                keyMaps.TryParse(@event.Key.ToString(), out keyCode);
                if ((int)keyCode > 0)
                {
                    if (@event.State == NeatInput.Windows.Processing.Keyboard.Enums.KeyStates.Up && activeKeys.Contains((int)keyCode))
                    { // remove key on upstroke
                        activeKeys.Remove((int)keyCode);
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

            public WootTrayApp()
            {
                var strip = new ContextMenuStrip()
                {
                    Items =
                        {
                            new ToolStripMenuItem("Stop overlay", null, new EventHandler(Exit), "EXIT")
                        }
                };
                strip.BackColor = Color.FromArgb(255, 20, 21, 24); ;
                strip.ForeColor = Color.White;
                strip.RenderMode = ToolStripRenderMode.System;

                trayIcon = new NotifyIcon()
                {
                    Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath),
                    ContextMenuStrip = strip,
                    Visible = true
                };
            }

            void Exit(object? sender, EventArgs e)
            {
                // Hide tray icon, otherwise it will remain shown until user mouses over it
                trayIcon.Visible = false;
                Application.Exit();
            }
        }
    }


}


