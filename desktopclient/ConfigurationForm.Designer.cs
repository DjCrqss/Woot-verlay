using System.Drawing.Drawing2D;

namespace Woot_verlay
{
    partial class SetupForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }


        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(SetupForm));
            startbtn = new RoundedButton();
            lanCheckbox = new CheckBox();
            wootingKbSelect = new RoundedButton();
            genericKbSelect = new RoundedButton();
            closeBtn = new Button();
            titlebar = new Panel();
            label1 = new Label();
            label2 = new Label();
            toolTip1 = new ToolTip(components);
            portinput = new NumericUpDown();
            titlebar.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)portinput).BeginInit();
            SuspendLayout();
            // 
            // startbtn
            // 
            startbtn.BackColor = Color.FromArgb(84, 150, 126);
            startbtn.BorderRadius = 35;
            startbtn.Cursor = Cursors.Hand;
            resources.ApplyResources(startbtn, "startbtn");
            startbtn.ForeColor = Color.White;
            startbtn.Name = "startbtn";
            startbtn.TextPositioning = TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter;
            startbtn.TextShift = 0;
            startbtn.UseVisualStyleBackColor = false;
            startbtn.Click += startBtn_Click;
            // 
            // lanCheckbox
            // 
            resources.ApplyResources(lanCheckbox, "lanCheckbox");
            lanCheckbox.Cursor = Cursors.Hand;
            lanCheckbox.FlatAppearance.CheckedBackColor = SystemColors.MenuText;
            lanCheckbox.ForeColor = Color.White;
            lanCheckbox.Name = "lanCheckbox";
            toolTip1.SetToolTip(lanCheckbox, resources.GetString("lanCheckbox.ToolTip"));
            lanCheckbox.UseVisualStyleBackColor = true;
            lanCheckbox.CheckedChanged += lanCheckbox_CheckedChanged;
            // 
            // wootingKbSelect
            // 
            wootingKbSelect.BackColor = Color.FromArgb(64, 64, 64);
            wootingKbSelect.BorderRadius = 15;
            wootingKbSelect.Cursor = Cursors.Hand;
            wootingKbSelect.FlatAppearance.BorderSize = 0;
            wootingKbSelect.FlatAppearance.MouseDownBackColor = Color.FromArgb(50, 50, 50);
            resources.ApplyResources(wootingKbSelect, "wootingKbSelect");
            wootingKbSelect.ForeColor = Color.White;
            wootingKbSelect.Name = "wootingKbSelect";
            wootingKbSelect.TextPositioning = TextFormatFlags.HorizontalCenter | TextFormatFlags.Bottom;
            wootingKbSelect.TextShift = -40;
            wootingKbSelect.UseVisualStyleBackColor = false;
            wootingKbSelect.Click += wootingKbSelect_Click;
            // 
            // genericKbSelect
            // 
            genericKbSelect.BackColor = Color.FromArgb(64, 64, 64);
            genericKbSelect.BorderRadius = 15;
            genericKbSelect.Cursor = Cursors.Hand;
            genericKbSelect.FlatAppearance.BorderSize = 0;
            genericKbSelect.FlatAppearance.MouseDownBackColor = Color.FromArgb(50, 50, 50);
            resources.ApplyResources(genericKbSelect, "genericKbSelect");
            genericKbSelect.ForeColor = Color.White;
            genericKbSelect.Name = "genericKbSelect";
            genericKbSelect.TextPositioning = TextFormatFlags.HorizontalCenter | TextFormatFlags.Bottom;
            genericKbSelect.TextShift = -25;
            genericKbSelect.UseVisualStyleBackColor = false;
            genericKbSelect.Click += genericKbSelect_Click;
            // 
            // closeBtn
            // 
            closeBtn.BackColor = Color.Black;
            closeBtn.Cursor = Cursors.Hand;
            closeBtn.FlatAppearance.BorderSize = 0;
            closeBtn.FlatAppearance.MouseDownBackColor = Color.Transparent;
            closeBtn.FlatAppearance.MouseOverBackColor = Color.Transparent;
            resources.ApplyResources(closeBtn, "closeBtn");
            closeBtn.ForeColor = SystemColors.ControlLight;
            closeBtn.Name = "closeBtn";
            closeBtn.UseVisualStyleBackColor = false;
            closeBtn.Click += closeBtn_Click;
            // 
            // titlebar
            // 
            titlebar.BackColor = Color.Transparent;
            titlebar.Controls.Add(label1);
            titlebar.Controls.Add(closeBtn);
            resources.ApplyResources(titlebar, "titlebar");
            titlebar.Name = "titlebar";
            titlebar.MouseDown += TitleBar_MouseDown;
            titlebar.MouseMove += TitleBar_MouseMove;
            titlebar.MouseUp += TitleBar_MouseUp;
            // 
            // label1
            // 
            resources.ApplyResources(label1, "label1");
            label1.Name = "label1";
            // 
            // label2
            // 
            resources.ApplyResources(label2, "label2");
            label2.Name = "label2";
            label2.Click += label2_Click;
            // 
            // toolTip1
            // 
            toolTip1.Popup += toolTip1_Popup;
            // 
            // portinput
            // 
            portinput.BackColor = Color.FromArgb(64, 64, 64);
            portinput.BorderStyle = BorderStyle.None;
            portinput.ForeColor = Color.White;
            resources.ApplyResources(portinput, "portinput");
            portinput.Maximum = new decimal(new int[] { 65535, 0, 0, 0 });
            portinput.Minimum = new decimal(new int[] { 1024, 0, 0, 0 });
            portinput.Name = "portinput";
            portinput.Value = new decimal(new int[] { 32312, 0, 0, 0 });
            // 
            // SetupForm
            // 
            resources.ApplyResources(this, "$this");
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.Black;
            ControlBox = false;
            Controls.Add(portinput);
            Controls.Add(label2);
            Controls.Add(genericKbSelect);
            Controls.Add(wootingKbSelect);
            Controls.Add(lanCheckbox);
            Controls.Add(startbtn);
            Controls.Add(titlebar);
            DoubleBuffered = true;
            ForeColor = SystemColors.ControlLight;
            FormBorderStyle = FormBorderStyle.None;
            MaximizeBox = false;
            MinimizeBox = false;
            Name = "SetupForm";
            SizeGripStyle = SizeGripStyle.Hide;
            Load += Form1_Load;
            titlebar.ResumeLayout(false);
            titlebar.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)portinput).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        private CheckBox lanCheckbox;
        private Button closeBtn;
        private Panel titlebar;
        private Label label1;
        private Label label2;
        private RoundedButton wootingKbSelect;
        private RoundedButton genericKbSelect;
        private RoundedButton startbtn;
        private ToolTip toolTip1;
        private NumericUpDown portinput;
    }

    public class RoundedButton : Button
    {
        public int BorderRadius { get; set; } = 45;
        public TextFormatFlags TextPositioning { get; set; } = TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter;
        public int TextShift { get; set; } = 0;

        protected override void OnPaint(PaintEventArgs pevent)
        {
            Graphics graphics = pevent.Graphics;
            graphics.SmoothingMode = SmoothingMode.AntiAlias;

            Rectangle rect = ClientRectangle;
            using (GraphicsPath path = new GraphicsPath())
            {
                int radius = BorderRadius;
                path.AddArc(rect.X, rect.Y, radius, radius, 180, 90); // Top-left corner
                path.AddArc(rect.Right - radius, rect.Y, radius, radius, 270, 90); // Top-right corner
                path.AddArc(rect.Right - radius, rect.Bottom - radius, radius, radius, 0, 90); // Bottom-right corner
                path.AddArc(rect.X, rect.Bottom - radius, radius, radius, 90, 90); // Bottom-left corner
                path.CloseAllFigures();

                Region = new Region(path); // Set the button's region to the rounded rectangle
                graphics.FillPath(new SolidBrush(BackColor), path); // Fill button with background color

                Rectangle textRect = new Rectangle(0, 0, this.Width, this.Height);
                textRect.Y += TextShift;

                // Draw text
                TextRenderer.DrawText(
                    graphics,
                    Text,
                    Font,
                    textRect,
                    ForeColor,
                    TextPositioning
                );

                // draw image top middle while keeping aspect ratio and have a max height of half the button height or 80% of the button width
                if (Image != null)
                {
                    // Calculate the width and height of the image while maintaining the aspect ratio
                    int imgWidth = Image.Width;
                    int imgHeight = Image.Height;

                    // Calculate the scaling factor (either original size or 80% of the max width)
                    float scaleFactor = Math.Min(0.85f * Width / imgWidth, 1.0f); // Ensures scaling to 80% of the width or full size
                    int scaledWidth = (int)(imgWidth * scaleFactor);
                    int scaledHeight = (int)(imgHeight * scaleFactor);

                    // Calculate the position to center the image horizontally and place it at the top
                    int imgX = (Width - scaledWidth) / 2;
                    int imgY = (int)((Width - scaledWidth) / 1.5);

                    // Draw the scaled image
                    graphics.DrawImage(Image, imgX, imgY, scaledWidth, scaledHeight);
                }
            }
        }
    }
}