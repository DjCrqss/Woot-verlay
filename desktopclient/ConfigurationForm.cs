using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;

namespace Woot_verlay
{
    public partial class SetupForm : Form
    {
        public bool EnableLanMode { get; private set; }
        public bool UseNonWooting { get; private set; }
        public bool noWootingAccess { get; private set; }

        private Color activeColor = Color.FromArgb(50, 255, 255, 255);
        private Color inactiveColor = Color.FromArgb(100, 70, 70, 70);



        public SetupForm(bool noWootingAccess)
        {
            this.noWootingAccess = noWootingAccess;
            InitializeComponent();
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            var graphicsPath = new GraphicsPath();
            int cornerRadius = 30; // Adjust the corner radius as needed

            // Define the rounded rectangle
            graphicsPath.AddArc(0, 0, cornerRadius, cornerRadius, 180, 90);
            graphicsPath.AddArc(Width - cornerRadius, 0, cornerRadius, cornerRadius, 270, 90);
            graphicsPath.AddArc(Width - cornerRadius, Height - cornerRadius, cornerRadius, cornerRadius, 0, 90);
            graphicsPath.AddArc(0, Height - cornerRadius, cornerRadius, cornerRadius, 90, 90);
            graphicsPath.CloseAllFigures();

            // Apply the rounded region to the form
            this.Region = new Region(graphicsPath);
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            WindowUtils.EnableAcrylic(this, Color.FromArgb(150, 10, 10, 10));
            base.OnHandleCreated(e);

            if (noWootingAccess)
            {
                wootingKbSelect.Enabled = false;
                wootingKbSelect.Text = "Wooting Keyboard (Not Detected)\n\n [!] Wooting Analog SDK failed to initialize.\nPlease install " +
                    "Wootility and restart,\n or install the SDK manually. [!]";
                // change font color
                inactiveColor = Color.FromArgb(100, 74, 49, 21);
                UseNonWooting = true;
            }

            // darken background of unpicked option
            updateKeyboardStyles();
        }

        private void updateKeyboardStyles()
        {

            if (UseNonWooting)
            {
                genericKbSelect.BackColor = activeColor;
                wootingKbSelect.BackColor = inactiveColor;
            }
            else
            {
                genericKbSelect.BackColor = inactiveColor;
                wootingKbSelect.BackColor = activeColor;
            }
        }


        // BUTTON INTERACTIONS
        private void startBtn_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.OK;
            this.Close();
        }
        private void lanCheckbox_CheckedChanged(object sender, EventArgs e)
        {
            EnableLanMode = lanCheckbox.Checked;
        }

        private void wootingKbSelect_Click(object sender, EventArgs e)
        {
            UseNonWooting = false;
            updateKeyboardStyles();
        }

        private void genericKbSelect_Click(object sender, EventArgs e)
        {
            UseNonWooting = true;
            updateKeyboardStyles();
        }

        private void closeBtn_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;
            this.Close();
        }


        // Titlebar Dragging
        private bool _dragging = false;
        private Point _dragCursorPoint;
        private Point _dragFormPoint;

        private void TitleBar_MouseDown(object sender, MouseEventArgs e)
        {
            _dragging = true;
            _dragCursorPoint = Cursor.Position;
            _dragFormPoint = this.Location;
        }

        private void TitleBar_MouseMove(object sender, MouseEventArgs e)
        {
            if (_dragging)
            {
                Point diff = Point.Subtract(Cursor.Position, new Size(_dragCursorPoint));
                this.Location = Point.Add(_dragFormPoint, new Size(diff));
            }
        }

        private void TitleBar_MouseUp(object sender, MouseEventArgs e)
        {
            _dragging = false;
        }

        private void toolTip1_Popup(object sender, PopupEventArgs e)
        {

        }

        private void label2_Click(object sender, EventArgs e)
        {

        }
    }

    public static class WindowUtils
    {
        public static void EnableAcrylic(IWin32Window window, Color blurColor)
        {
            if (window is null) throw new ArgumentNullException(nameof(window));

            var accentPolicy = new AccentPolicy
            {
                AccentState = ACCENT.ENABLE_ACRYLICBLURBEHIND,
                GradientColor = ToAbgr(blurColor)
            };

            var accentPolicySize = Marshal.SizeOf(accentPolicy);
            var accentPolicyPtr = Marshal.AllocHGlobal(accentPolicySize);

            try
            {
                Marshal.StructureToPtr(accentPolicy, accentPolicyPtr, false);

                var data = new WindowCompositionAttributeData
                {
                    Attribute = WCA.ACCENT_POLICY,
                    Data = accentPolicyPtr,
                    DataLength = accentPolicySize
                };

                SetWindowCompositionAttribute(new HandleRef(window, window.Handle), in data);
            }
            finally
            {
                Marshal.FreeHGlobal(accentPolicyPtr);
            }
        }

        private static uint ToAbgr(Color color)
        {
            return ((uint)color.A << 24)
                | ((uint)color.B << 16)
                | ((uint)color.G << 8)
                | color.R;
        }

        [DllImport("user32.dll")]
        private static extern int SetWindowCompositionAttribute(HandleRef hWnd, in WindowCompositionAttributeData data);

        private struct WindowCompositionAttributeData
        {
            public WCA Attribute;
            public IntPtr Data;
            public int DataLength;
        }

        private enum WCA
        {
            ACCENT_POLICY = 19
        }

        private enum ACCENT
        {
            DISABLED = 0,
            ENABLE_GRADIENT = 1,
            ENABLE_TRANSPARENTGRADIENT = 2,
            ENABLE_BLURBEHIND = 3,
            ENABLE_ACRYLICBLURBEHIND = 4,
            INVALID_STATE = 5
        }

        private struct AccentPolicy
        {
            public ACCENT AccentState;
            public uint AccentFlags;
            public uint GradientColor;
            public uint AnimationId;
        }
    }
}
