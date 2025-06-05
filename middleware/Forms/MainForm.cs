using System;
using System.Drawing;
using System.Windows.Forms;
using BiometricGymSystem.Forms;

namespace BiometricGymSystem.Forms
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();
            
            // Form properties
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1000, 700);
            this.Text = "ZKTeco K40 Biometric System - Staff Desktop";
            this.StartPosition = FormStartPosition.CenterScreen;
            this.WindowState = FormWindowState.Maximized;

            CreateMenuBar();
            CreateMainContent();

            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private MenuStrip menuStrip;
        private ToolStripMenuItem memberMenu, deviceMenu, reportsMenu, helpMenu;
        private ToolStripMenuItem registerMemberItem, verifyMemberItem, manageMembersItem;
        private ToolStripMenuItem manageDevicesItem, deviceStatusItem;
        private ToolStripMenuItem attendanceReportItem, memberReportItem;
        private ToolStripMenuItem aboutItem, helpItem;

        private Panel mainPanel;
        private Label lblWelcome, lblInstructions;
        private Button btnRegisterMember, btnVerifyMember, btnManageDevices, btnViewReports;

        private void CreateMenuBar()
        {
            menuStrip = new MenuStrip();

            // Member Menu
            memberMenu = new ToolStripMenuItem("&Member");
            
            registerMemberItem = new ToolStripMenuItem("&Register New Member");
            registerMemberItem.ShortcutKeys = Keys.Control | Keys.R;
            registerMemberItem.Click += RegisterMemberItem_Click;

            verifyMemberItem = new ToolStripMenuItem("&Verify Member");
            verifyMemberItem.ShortcutKeys = Keys.Control | Keys.V;
            verifyMemberItem.Click += VerifyMemberItem_Click;

            manageMembersItem = new ToolStripMenuItem("&Manage Members");
            manageMembersItem.ShortcutKeys = Keys.Control | Keys.M;
            manageMembersItem.Click += ManageMembersItem_Click;

            memberMenu.DropDownItems.AddRange(new ToolStripItem[] {
                registerMemberItem,
                verifyMemberItem,
                new ToolStripSeparator(),
                manageMembersItem
            });

            // Device Menu
            deviceMenu = new ToolStripMenuItem("&Device");
            
            manageDevicesItem = new ToolStripMenuItem("&Manage Devices");
            manageDevicesItem.Click += ManageDevicesItem_Click;

            deviceStatusItem = new ToolStripMenuItem("&Device Status");
            deviceStatusItem.Click += DeviceStatusItem_Click;

            deviceMenu.DropDownItems.AddRange(new ToolStripItem[] {
                manageDevicesItem,
                deviceStatusItem
            });

            // Reports Menu
            reportsMenu = new ToolStripMenuItem("&Reports");
            
            attendanceReportItem = new ToolStripMenuItem("&Attendance Report");
            attendanceReportItem.Click += AttendanceReportItem_Click;

            memberReportItem = new ToolStripMenuItem("&Member Report");
            memberReportItem.Click += MemberReportItem_Click;

            reportsMenu.DropDownItems.AddRange(new ToolStripItem[] {
                attendanceReportItem,
                memberReportItem
            });

            // Help Menu
            helpMenu = new ToolStripMenuItem("&Help");
            
            helpItem = new ToolStripMenuItem("&User Guide");
            helpItem.Click += HelpItem_Click;

            aboutItem = new ToolStripMenuItem("&About");
            aboutItem.Click += AboutItem_Click;

            helpMenu.DropDownItems.AddRange(new ToolStripItem[] {
                helpItem,
                new ToolStripSeparator(),
                aboutItem
            });

            menuStrip.Items.AddRange(new ToolStripItem[] {
                memberMenu, deviceMenu, reportsMenu, helpMenu
            });

            this.MainMenuStrip = menuStrip;
            this.Controls.Add(menuStrip);
        }

        private void CreateMainContent()
        {
            mainPanel = new Panel();
            mainPanel.Location = new Point(0, menuStrip.Height);
            mainPanel.Size = new Size(this.ClientSize.Width, this.ClientSize.Height - menuStrip.Height);
            mainPanel.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            mainPanel.BackColor = Color.FromArgb(248, 250, 252);

            // Welcome label
            lblWelcome = new Label();
            lblWelcome.Text = "Welcome to ZKTeco K40 Biometric System";
            lblWelcome.Font = new Font("Segoe UI", 24, FontStyle.Bold);
            lblWelcome.ForeColor = Color.FromArgb(30, 64, 175);
            lblWelcome.AutoSize = true;
            lblWelcome.Location = new Point(50, 50);

            // Instructions label
            lblInstructions = new Label();
            lblInstructions.Text = "Staff Desktop Application - Choose an option below or use the menu bar";
            lblInstructions.Font = new Font("Segoe UI", 12);
            lblInstructions.ForeColor = Color.FromArgb(75, 85, 99);
            lblInstructions.AutoSize = true;
            lblInstructions.Location = new Point(50, 100);

            // Quick action buttons
            btnRegisterMember = new Button();
            btnRegisterMember.Text = "Register New Member";
            btnRegisterMember.Size = new Size(200, 80);
            btnRegisterMember.Location = new Point(50, 180);
            btnRegisterMember.BackColor = Color.FromArgb(59, 130, 246);
            btnRegisterMember.ForeColor = Color.White;
            btnRegisterMember.FlatStyle = FlatStyle.Flat;
            btnRegisterMember.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            btnRegisterMember.Click += RegisterMemberItem_Click;

            btnVerifyMember = new Button();
            btnVerifyMember.Text = "Verify Member";
            btnVerifyMember.Size = new Size(200, 80);
            btnVerifyMember.Location = new Point(270, 180);
            btnVerifyMember.BackColor = Color.FromArgb(34, 197, 94);
            btnVerifyMember.ForeColor = Color.White;
            btnVerifyMember.FlatStyle = FlatStyle.Flat;
            btnVerifyMember.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            btnVerifyMember.Click += VerifyMemberItem_Click;

            btnManageDevices = new Button();
            btnManageDevices.Text = "Manage Devices";
            btnManageDevices.Size = new Size(200, 80);
            btnManageDevices.Location = new Point(490, 180);
            btnManageDevices.BackColor = Color.FromArgb(168, 85, 247);
            btnManageDevices.ForeColor = Color.White;
            btnManageDevices.FlatStyle = FlatStyle.Flat;
            btnManageDevices.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            btnManageDevices.Click += ManageDevicesItem_Click;

            btnViewReports = new Button();
            btnViewReports.Text = "View Reports";
            btnViewReports.Size = new Size(200, 80);
            btnViewReports.Location = new Point(710, 180);
            btnViewReports.BackColor = Color.FromArgb(245, 158, 11);
            btnViewReports.ForeColor = Color.White;
            btnViewReports.FlatStyle = FlatStyle.Flat;
            btnViewReports.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            btnViewReports.Click += AttendanceReportItem_Click;

            // Add system status panel
            CreateStatusPanel();

            mainPanel.Controls.AddRange(new Control[] {
                lblWelcome, lblInstructions, btnRegisterMember, btnVerifyMember, 
                btnManageDevices, btnViewReports
            });

            this.Controls.Add(mainPanel);
        }

        private GroupBox grpStatus;
        private Label lblSystemStatus, lblDeviceCount, lblMemberCount, lblLastActivity;

        private void CreateStatusPanel()
        {
            grpStatus = new GroupBox();
            grpStatus.Text = "System Status";
            grpStatus.Location = new Point(50, 300);
            grpStatus.Size = new Size(860, 150);
            grpStatus.Font = new Font("Segoe UI", 10, FontStyle.Bold);

            lblSystemStatus = new Label();
            lblSystemStatus.Text = "System Status: Online";
            lblSystemStatus.Location = new Point(20, 30);
            lblSystemStatus.Size = new Size(200, 25);
            lblSystemStatus.ForeColor = Color.Green;
            lblSystemStatus.Font = new Font("Segoe UI", 10);

            lblDeviceCount = new Label();
            lblDeviceCount.Text = "Connected Devices: Loading...";
            lblDeviceCount.Location = new Point(20, 60);
            lblDeviceCount.Size = new Size(200, 25);
            lblDeviceCount.Font = new Font("Segoe UI", 10);

            lblMemberCount = new Label();
            lblMemberCount.Text = "Total Members: Loading...";
            lblMemberCount.Location = new Point(20, 90);
            lblMemberCount.Size = new Size(200, 25);
            lblMemberCount.Font = new Font("Segoe UI", 10);

            lblLastActivity = new Label();
            lblLastActivity.Text = "Last Activity: Loading...";
            lblLastActivity.Location = new Point(20, 120);
            lblLastActivity.Size = new Size(400, 25);
            lblLastActivity.Font = new Font("Segoe UI", 10);

            grpStatus.Controls.AddRange(new Control[] {
                lblSystemStatus, lblDeviceCount, lblMemberCount, lblLastActivity
            });

            mainPanel.Controls.Add(grpStatus);

            // Load status information
            LoadSystemStatus();
        }

        private async void LoadSystemStatus()
        {
            try
            {
                using (var httpClient = new System.Net.Http.HttpClient())
                {
                    // Get device count
                    var devicesResponse = await httpClient.GetStringAsync("http://localhost:8000/api/devices");
                    var devices = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Collections.Generic.List<dynamic>>(devicesResponse);
                    var onlineDevices = devices.Count(d => d.status.ToString() == "online");
                    lblDeviceCount.Text = $"Connected Devices: {onlineDevices}/{devices.Count}";

                    // Get member count
                    var membersResponse = await httpClient.GetStringAsync("http://localhost:8000/api/members");
                    var members = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Collections.Generic.List<dynamic>>(membersResponse);
                    lblMemberCount.Text = $"Total Members: {members.Count}";

                    // Get last activity
                    var recognitionResponse = await httpClient.GetStringAsync("http://localhost:8000/api/recognition?limit=1");
                    var recognitions = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Collections.Generic.List<dynamic>>(recognitionResponse);
                    if (recognitions.Count > 0)
                    {
                        var lastActivity = DateTime.Parse(recognitions[0].timestamp.ToString());
                        lblLastActivity.Text = $"Last Activity: {lastActivity:yyyy-MM-dd HH:mm:ss}";
                    }
                    else
                    {
                        lblLastActivity.Text = "Last Activity: No recent activity";
                    }
                }
            }
            catch (Exception ex)
            {
                lblSystemStatus.Text = "System Status: Connection Error";
                lblSystemStatus.ForeColor = Color.Red;
                lblDeviceCount.Text = "Connected Devices: Unable to connect";
                lblMemberCount.Text = "Total Members: Unable to connect";
                lblLastActivity.Text = $"Error: {ex.Message}";
            }
        }

        // Event handlers
        private void RegisterMemberItem_Click(object sender, EventArgs e)
        {
            var registrationForm = new MemberRegistration();
            registrationForm.ShowDialog();
        }

        private void VerifyMemberItem_Click(object sender, EventArgs e)
        {
            var verificationForm = new MemberVerification();
            verificationForm.ShowDialog();
        }

        private void ManageMembersItem_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Member management will open the web interface.\nPlease use your browser to access: http://localhost:3000/members", 
                          "Member Management", MessageBoxButtons.OK, MessageBoxIcon.Information);
            
            try
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "http://localhost:3000/members",
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Unable to open browser: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void ManageDevicesItem_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Device management will open the web interface.\nPlease use your browser to access: http://localhost:3000/devices", 
                          "Device Management", MessageBoxButtons.OK, MessageBoxIcon.Information);
            
            try
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "http://localhost:3000/devices",
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Unable to open browser: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void DeviceStatusItem_Click(object sender, EventArgs e)
        {
            LoadSystemStatus();
            MessageBox.Show("System status refreshed!", "Device Status", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void AttendanceReportItem_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Attendance reports will open the web interface.\nPlease use your browser to access: http://localhost:3000/attendance", 
                          "Attendance Reports", MessageBoxButtons.OK, MessageBoxIcon.Information);
            
            try
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "http://localhost:3000/attendance",
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Unable to open browser: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void MemberReportItem_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Member reports will open the web interface.\nPlease use your browser to access: http://localhost:3000/members", 
                          "Member Reports", MessageBoxButtons.OK, MessageBoxIcon.Information);
            
            try
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "http://localhost:3000/members",
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Unable to open browser: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void HelpItem_Click(object sender, EventArgs e)
        {
            string helpText = @"ZKTeco K40 Biometric System - Staff Desktop

QUICK START:
1. Register New Member - Add new gym members and enroll their fingerprints
2. Verify Member - Verify member identity using member number or fingerprint
3. Manage Devices - Configure and monitor ZKTeco devices
4. View Reports - Access attendance and member reports

KEYBOARD SHORTCUTS:
Ctrl+R - Register New Member
Ctrl+V - Verify Member
Ctrl+M - Manage Members

SUPPORT:
For technical support, please contact your system administrator.";

            MessageBox.Show(helpText, "User Guide", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void AboutItem_Click(object sender, EventArgs e)
        {
            string aboutText = @"ZKTeco K40 Biometric System
Staff Desktop Application

Version: 1.0.0
Built for: Gym Management
Device Support: ZKTeco K40

© 2024 Biometric Gym System
All rights reserved.";

            MessageBox.Show(aboutText, "About", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        protected override void OnResize(EventArgs e)
        {
            base.OnResize(e);
            if (mainPanel != null)
            {
                mainPanel.Size = new Size(this.ClientSize.Width, this.ClientSize.Height - menuStrip.Height);
            }
        }
    }
} 