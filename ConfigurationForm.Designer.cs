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
            startbtn = new RoundedButton();
            lanCheckbox = new CheckBox();
            wootingKbSelect = new RoundedButton();
            genericKbSelect = new RoundedButton();
            closeBtn = new Button();
            titlebar = new Panel();
            label1 = new Label();
            label2 = new Label();
            titlebar.SuspendLayout();
            SuspendLayout();
            // 
            // startbtn
            // 
            startbtn.BackColor = Color.Gainsboro;
            startbtn.BorderRadius = 45;
            startbtn.Cursor = Cursors.Hand;
            startbtn.FlatStyle = FlatStyle.Flat;
            startbtn.ForeColor = SystemColors.ActiveCaptionText;
            startbtn.Location = new Point(551, 372);
            startbtn.Name = "startbtn";
            startbtn.Size = new Size(138, 44);
            startbtn.TabIndex = 0;
            startbtn.Text = "Start";
            startbtn.UseVisualStyleBackColor = false;
            startbtn.Click += startBtn_Click;
            // 
            // lanCheckbox
            // 
            lanCheckbox.AutoSize = true;
            lanCheckbox.Cursor = Cursors.Hand;
            lanCheckbox.FlatStyle = FlatStyle.Flat;
            lanCheckbox.Location = new Point(398, 382);
            lanCheckbox.Name = "lanCheckbox";
            lanCheckbox.Size = new Size(126, 24);
            lanCheckbox.TabIndex = 1;
            lanCheckbox.Text = "Use LAN Mode";
            lanCheckbox.UseVisualStyleBackColor = true;
            lanCheckbox.CheckedChanged += lanCheckbox_CheckedChanged;
            // 
            // wootingKbSelect
            // 
            wootingKbSelect.BackColor = Color.Black;
            wootingKbSelect.BorderRadius = 15;
            wootingKbSelect.Cursor = Cursors.Hand;
            wootingKbSelect.FlatAppearance.BorderSize = 0;
            wootingKbSelect.FlatAppearance.MouseDownBackColor = Color.FromArgb(50, 50, 50);
            wootingKbSelect.FlatStyle = FlatStyle.Flat;
            wootingKbSelect.ForeColor = Color.White;
            wootingKbSelect.Location = new Point(17, 115);
            wootingKbSelect.Name = "wootingKbSelect";
            wootingKbSelect.Size = new Size(327, 227);
            wootingKbSelect.TabIndex = 3;
            wootingKbSelect.Text = "Wooting Keyboard\r\n\r\nHave full analog values displayed per-key.";
            wootingKbSelect.UseVisualStyleBackColor = true;
            wootingKbSelect.Click += wootingKbSelect_Click;
            // 
            // genericKbSelect
            // 
            genericKbSelect.BackColor = Color.Gainsboro;
            genericKbSelect.BorderRadius = 15;
            genericKbSelect.Cursor = Cursors.Hand;
            genericKbSelect.FlatAppearance.BorderSize = 0;
            genericKbSelect.FlatAppearance.MouseDownBackColor = Color.FromArgb(50, 50, 50);
            genericKbSelect.FlatStyle = FlatStyle.Flat;
            genericKbSelect.ForeColor = Color.White;
            genericKbSelect.Location = new Point(362, 115);
            genericKbSelect.Name = "genericKbSelect";
            genericKbSelect.Size = new Size(327, 227);
            genericKbSelect.TabIndex = 4;
            genericKbSelect.Text = "Standard or Hall Effect Keyboard\r\n\r\nDisplay calculated values for WASD keys \r\nusing controller input or active status on \r\nnon-hall effect keyboards.";
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
            closeBtn.FlatStyle = FlatStyle.Flat;
            closeBtn.ForeColor = SystemColors.ControlLight;
            closeBtn.Location = new Point(635, 13);
            closeBtn.Name = "closeBtn";
            closeBtn.Size = new Size(55, 36);
            closeBtn.TabIndex = 5;
            closeBtn.Text = "close";
            closeBtn.UseVisualStyleBackColor = false;
            closeBtn.Click += closeBtn_Click;
            // 
            // titlebar
            // 
            titlebar.BackColor = Color.Transparent;
            titlebar.Controls.Add(label1);
            titlebar.Controls.Add(closeBtn);
            titlebar.Location = new Point(-1, -1);
            titlebar.Name = "titlebar";
            titlebar.Size = new Size(707, 55);
            titlebar.TabIndex = 6;
            titlebar.Paint += titlebar_Paint;
            titlebar.MouseDown += TitleBar_MouseDown;
            titlebar.MouseMove += TitleBar_MouseMove;
            titlebar.MouseUp += TitleBar_MouseUp;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Segoe UI", 12F, FontStyle.Bold, GraphicsUnit.Point);
            label1.Location = new Point(18, 17);
            label1.Name = "label1";
            label1.Size = new Size(188, 28);
            label1.TabIndex = 7;
            label1.Text = "Woot-verlay Setup";
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Font = new Font("Segoe UI", 10F, FontStyle.Regular, GraphicsUnit.Point);
            label2.Location = new Point(267, 76);
            label2.Name = "label2";
            label2.Size = new Size(177, 23);
            label2.TabIndex = 8;
            label2.Text = "choose keyboard type";
            label2.Click += label2_Click;
            // 
            // SetupForm
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.Black;
            ClientSize = new Size(706, 433);
            ControlBox = false;
            Controls.Add(label2);
            Controls.Add(genericKbSelect);
            Controls.Add(wootingKbSelect);
            Controls.Add(lanCheckbox);
            Controls.Add(startbtn);
            Controls.Add(titlebar);
            ForeColor = SystemColors.ControlLight;
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            MinimizeBox = false;
            Name = "SetupForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "HE-Overlay Setup";
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