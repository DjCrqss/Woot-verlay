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
            titlebar.SuspendLayout();
            SuspendLayout();
            // 
            // startbtn
            // 
            resources.ApplyResources(startbtn, "startbtn");
            startbtn.BackColor = Color.FromArgb(84, 150, 126);
            startbtn.BorderRadius = 45;
            startbtn.Cursor = Cursors.Hand;
            startbtn.ForeColor = Color.White;
            startbtn.Name = "startbtn";
            toolTip1.SetToolTip(startbtn, resources.GetString("startbtn.ToolTip"));
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
            resources.ApplyResources(wootingKbSelect, "wootingKbSelect");
            wootingKbSelect.BackColor = Color.Black;
            wootingKbSelect.BorderRadius = 15;
            wootingKbSelect.Cursor = Cursors.Hand;
            wootingKbSelect.FlatAppearance.BorderSize = 0;
            wootingKbSelect.FlatAppearance.MouseDownBackColor = Color.FromArgb(50, 50, 50);
            wootingKbSelect.ForeColor = Color.White;
            wootingKbSelect.Name = "wootingKbSelect";
            toolTip1.SetToolTip(wootingKbSelect, resources.GetString("wootingKbSelect.ToolTip"));
            wootingKbSelect.UseVisualStyleBackColor = true;
            wootingKbSelect.Click += wootingKbSelect_Click;
            // 
            // genericKbSelect
            // 
            resources.ApplyResources(genericKbSelect, "genericKbSelect");
            genericKbSelect.BackColor = Color.Gainsboro;
            genericKbSelect.BorderRadius = 15;
            genericKbSelect.Cursor = Cursors.Hand;
            genericKbSelect.FlatAppearance.BorderSize = 0;
            genericKbSelect.FlatAppearance.MouseDownBackColor = Color.FromArgb(50, 50, 50);
            genericKbSelect.ForeColor = Color.White;
            genericKbSelect.Name = "genericKbSelect";
            toolTip1.SetToolTip(genericKbSelect, resources.GetString("genericKbSelect.ToolTip"));
            genericKbSelect.UseVisualStyleBackColor = false;
            genericKbSelect.Click += genericKbSelect_Click;
            // 
            // closeBtn
            // 
            resources.ApplyResources(closeBtn, "closeBtn");
            closeBtn.BackColor = Color.Black;
            closeBtn.Cursor = Cursors.Hand;
            closeBtn.FlatAppearance.BorderSize = 0;
            closeBtn.FlatAppearance.MouseDownBackColor = Color.Transparent;
            closeBtn.FlatAppearance.MouseOverBackColor = Color.Transparent;
            closeBtn.ForeColor = SystemColors.ControlLight;
            closeBtn.Name = "closeBtn";
            toolTip1.SetToolTip(closeBtn, resources.GetString("closeBtn.ToolTip"));
            closeBtn.UseVisualStyleBackColor = false;
            closeBtn.Click += closeBtn_Click;
            // 
            // titlebar
            // 
            resources.ApplyResources(titlebar, "titlebar");
            titlebar.BackColor = Color.Transparent;
            titlebar.Controls.Add(label1);
            titlebar.Controls.Add(closeBtn);
            titlebar.Name = "titlebar";
            toolTip1.SetToolTip(titlebar, resources.GetString("titlebar.ToolTip"));
            titlebar.MouseDown += TitleBar_MouseDown;
            titlebar.MouseMove += TitleBar_MouseMove;
            titlebar.MouseUp += TitleBar_MouseUp;
            // 
            // label1
            // 
            resources.ApplyResources(label1, "label1");
            label1.Name = "label1";
            toolTip1.SetToolTip(label1, resources.GetString("label1.ToolTip"));
            // 
            // label2
            // 
            resources.ApplyResources(label2, "label2");
            label2.Name = "label2";
            toolTip1.SetToolTip(label2, resources.GetString("label2.ToolTip"));
            label2.Click += label2_Click;
            // 
            // toolTip1
            // 
            toolTip1.Popup += toolTip1_Popup;
            // 
            // SetupForm
            // 
            resources.ApplyResources(this, "$this");
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.Black;
            ControlBox = false;
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
            toolTip1.SetToolTip(this, resources.GetString("$this.ToolTip"));
            Load += Form1_Load;
            titlebar.ResumeLayout(false);
            titlebar.PerformLayout();
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
    }

    public class RoundedButton : Button
    {
        public int BorderRadius { get; set; } = 45;

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

                // Draw text
                TextRenderer.DrawText(
                    graphics,
                    Text,
                    Font,
                    rect,
                    ForeColor,
                    TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter
                );
            }
        }
    }
}