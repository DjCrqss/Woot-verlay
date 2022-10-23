using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using WootingAnalogSDKNET;
using NeatInput.Windows;
using NeatInput.Windows.Events;

using System.Runtime.InteropServices;
using System.Drawing;

namespace Socket{
    class Server {
        

        internal class MyKeyboardEventReceiver : IKeyboardEventReceiver
        {
            // convert key events to wooting key numbers
            enum keyMaps{
                A=4, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, // Z = 29
                D1, D2, D3, D4, D5, D6, D7, D8, D9, D0, // 0 key is 39
                Escape = 41, Back, Tab, Space, OemMinus, OemPlus, OemOpenBrackets, OemCloseBrackets, Oem5, //   \ = 49 
                 LControlKey=224, LShiftKey, LMenu, LWin // LWin = 227
            }

            // store active keys
            public List<int> activeKeys = new List<int>();

            // store actuation points later

            // listen key upstrokes and downstrokes
            public void Receive(KeyboardEvent @event)
            {
                var keyCode= keyMaps.Space;
                // Console.WriteLine(@event.Key.ToString());
                keyMaps.TryParse(@event.Key.ToString(), out keyCode);
                if((int)keyCode > 0){
                    if(@event.State == NeatInput.Windows.Processing.Keyboard.Enums.KeyStates.Up && activeKeys.Contains((int)keyCode)){
                        activeKeys.Remove((int)keyCode);
                    } else if (!activeKeys.Contains((int)keyCode)) {
                         activeKeys.Add((int)keyCode);
                         
                    }
                }
            }
        }
      
        // Sends message to JavaScript client
        private static void SendEcho(NetworkStream stream, string inputText)
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
            { lengthHeader = 127;
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

        public static void handleClients(TcpListener server){
            while(true){
                TcpClient client = server.AcceptTcpClient();
                NetworkStream stream = client.GetStream();
            
                bool hasHandshaked = false;
                // client information
                while(!hasHandshaked && client.Connected){
                    byte[] bytes = new byte[client.Available];
                    stream.Read(bytes, 0, client.Available);
                    string s = Encoding.UTF8.GetString(bytes);

                    // provide first link handshake
                    if (Regex.IsMatch(s, "^GET", RegexOptions.IgnoreCase)) {
                        Console.WriteLine("=====Handshaking from client=====\n{0}==============================\n", s);
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
                        Console.WriteLine("Client " + activeConnections.Count + " connected.\n");
                    } 
                }

                
            }
        }


        public static List<TcpClient> activeConnections = new List<TcpClient>();
        public static void Main() {
            var keyboardReceiver = new MyKeyboardEventReceiver();
            var inputSource = new InputSource(keyboardReceiver);
        
            // Starts listening for input
            inputSource.Listen();

            // Load WootingAnalogSDK
            Console.WriteLine("Woot-verlay launched!\n");

            // Initialise the SDK
            var (noDevices, error) = WootingAnalogSDK.Initialise();
            // If the number of devices is at least 0 it indicates the initialisation was successful
            if (noDevices >= 0) {
                Console.WriteLine($"\nAnalog SDK Successfully initialised with {noDevices} devices!");
            } else {
                Console.WriteLine($"\nAnalog SDK failed to initialise: {error}");
                System.Environment.Exit(1);
            }

            // initialise server
            string ip = "127.0.0.1";
            int port = 80;
            var server = new TcpListener(IPAddress.Parse(ip), port);
            server.Start();
            Console.WriteLine("\nServer has started on {0}:{1}, Waiting for a connection…\n", ip, port);

            ThreadPool.QueueUserWorkItem(o => handleClients(server));
            
            // run SDK loop
            bool shownEmpty = false;
            while(true){

                 List<TcpClient> disconnected = activeConnections.FindAll(curClient => !curClient.Connected);
                 if(disconnected.Count > 0){
                    Console.WriteLine(disconnected.Count + " client/s disconnected. " + activeConnections.Count + " connections remaining.\n");
                    disconnected.ForEach(client => activeConnections.Remove(client));
                }

                var (keys, readErr) = WootingAnalogSDK.ReadFullBuffer(20);
                if (readErr == WootingAnalogResult.Ok) {
                    // collect all key information
                    try{    
                        if (keys.Count > 0){
                            String content = "";
                            foreach (var analog in keys) {
                                var pressed = (keyboardReceiver.activeKeys.Contains(analog.Item1)) ? 1 : 0;
                                content += "(" + analog.Item1 + ":" + analog.Item2 + ":" + pressed + ")";
                            }
                            // message info to client for display
                            activeConnections.ForEach(curClient => SendEcho(curClient.GetStream(), content));
                            shownEmpty = false;
            
                        } else if (!shownEmpty){
                            // allow a single empty line after all keys are released
                            activeConnections.ForEach(curClient => SendEcho(curClient.GetStream(), ""));
                            shownEmpty = true;
                        }
                    } catch(Exception){
                        Console.WriteLine("Client unavailable - removing next loop.");
                    }
                }
                else {
                    Console.WriteLine($"Read failed with {readErr}");
                    Thread.Sleep(1000);
                }
                // We want to have a bit of a delay so we don't spam the console with new values
                Thread.Sleep(25);
            }
        }
    }
}
