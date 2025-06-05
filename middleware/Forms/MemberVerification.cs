using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Http;
using Newtonsoft.Json;

namespace BiometricGymSystem.Forms
{
    public partial class MemberVerification : Form
    {
        private readonly HttpClient _httpClient;
        private List<dynamic> _devices;
        private dynamic _verifiedMember;

        // Controls
        private GroupBox grpVerificationMethod;
        private RadioButton rbMemberNumber, rbFingerprint;
        
        private GroupBox grpMemberNumber;
        private Label lblMemberNumber;
        private TextBox txtMemberNumber;
        private Button btnSearchByNumber;

        private GroupBox grpFingerprint;
        private Label lblDevice, lblStatus;
        private ComboBox cmbDevice;
        private Button btnStartVerification;
        private ProgressBar progressVerification;
        private Label lblProgress;

        private GroupBox grpMemberInfo;
        private Label lblMemberName, lblMemberPhone, lblMemberEmail, lblMemberType, lblMemberStatus;
        private Label lblNameValue, lblPhoneValue, lblEmailValue, lblTypeValue, lblStatusValue;
        private PictureBox picMemberPhoto;

        private Button btnClose, btnPrintCard;

        public MemberVerification()
        {
            InitializeComponent();
            _httpClient = new HttpClient();
            LoadDevices();
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();
            
            // Form properties
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 700);
            this.Text = "Member Verification - Staff Desktop";
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;

            CreateVerificationMethodControls();
            CreateMemberNumberControls();
            CreateFingerprintControls();
            CreateMemberInfoControls();
            CreateActionButtons();

            this.ResumeLayout(false);
            this.PerformLayout();
        }

        private void CreateVerificationMethodControls()
        {
            grpVerificationMethod = new GroupBox();
            grpVerificationMethod.Text = "Verification Method";
            grpVerificationMethod.Location = new Point(20, 20);
            grpVerificationMethod.Size = new Size(750, 80);

            rbMemberNumber = new RadioButton();
            rbMemberNumber.Text = "Verify by Member Number";
            rbMemberNumber.Location = new Point(30, 30);
            rbMemberNumber.Size = new Size(200, 25);
            rbMemberNumber.Checked = true;
            rbMemberNumber.CheckedChanged += RbMemberNumber_CheckedChanged;

            rbFingerprint = new RadioButton();
            rbFingerprint.Text = "Verify by Fingerprint";
            rbFingerprint.Location = new Point(250, 30);
            rbFingerprint.Size = new Size(200, 25);
            rbFingerprint.CheckedChanged += RbFingerprint_CheckedChanged;

            grpVerificationMethod.Controls.AddRange(new Control[] { rbMemberNumber, rbFingerprint });
            this.Controls.Add(grpVerificationMethod);
        }

        private void CreateMemberNumberControls()
        {
            grpMemberNumber = new GroupBox();
            grpMemberNumber.Text = "Member Number Verification";
            grpMemberNumber.Location = new Point(20, 120);
            grpMemberNumber.Size = new Size(750, 100);

            lblMemberNumber = new Label();
            lblMemberNumber.Text = "Enter Member Number:";
            lblMemberNumber.Location = new Point(20, 30);
            lblMemberNumber.Size = new Size(150, 23);

            txtMemberNumber = new TextBox();
            txtMemberNumber.Location = new Point(180, 30);
            txtMemberNumber.Size = new Size(200, 23);
            txtMemberNumber.KeyPress += TxtMemberNumber_KeyPress;

            btnSearchByNumber = new Button();
            btnSearchByNumber.Text = "Search Member";
            btnSearchByNumber.Location = new Point(400, 25);
            btnSearchByNumber.Size = new Size(120, 35);
            btnSearchByNumber.BackColor = Color.FromArgb(59, 130, 246);
            btnSearchByNumber.ForeColor = Color.White;
            btnSearchByNumber.FlatStyle = FlatStyle.Flat;
            btnSearchByNumber.Click += BtnSearchByNumber_Click;

            grpMemberNumber.Controls.AddRange(new Control[] { lblMemberNumber, txtMemberNumber, btnSearchByNumber });
            this.Controls.Add(grpMemberNumber);
        }

        private void CreateFingerprintControls()
        {
            grpFingerprint = new GroupBox();
            grpFingerprint.Text = "Fingerprint Verification";
            grpFingerprint.Location = new Point(20, 240);
            grpFingerprint.Size = new Size(750, 150);
            grpFingerprint.Enabled = false;

            lblDevice = new Label();
            lblDevice.Text = "Select Device:";
            lblDevice.Location = new Point(20, 30);
            lblDevice.Size = new Size(100, 23);

            cmbDevice = new ComboBox();
            cmbDevice.Location = new Point(130, 30);
            cmbDevice.Size = new Size(250, 23);
            cmbDevice.DropDownStyle = ComboBoxStyle.DropDownList;

            btnStartVerification = new Button();
            btnStartVerification.Text = "Start Fingerprint Verification";
            btnStartVerification.Location = new Point(20, 70);
            btnStartVerification.Size = new Size(200, 35);
            btnStartVerification.BackColor = Color.FromArgb(34, 197, 94);
            btnStartVerification.ForeColor = Color.White;
            btnStartVerification.FlatStyle = FlatStyle.Flat;
            btnStartVerification.Click += BtnStartVerification_Click;

            progressVerification = new ProgressBar();
            progressVerification.Location = new Point(240, 70);
            progressVerification.Size = new Size(300, 25);
            progressVerification.Visible = false;

            lblProgress = new Label();
            lblProgress.Text = "";
            lblProgress.Location = new Point(240, 100);
            lblProgress.Size = new Size(300, 23);
            lblProgress.ForeColor = Color.Blue;

            lblStatus = new Label();
            lblStatus.Text = "Ready for verification";
            lblStatus.Location = new Point(20, 110);
            lblStatus.Size = new Size(500, 23);
            lblStatus.ForeColor = Color.Green;

            grpFingerprint.Controls.AddRange(new Control[] {
                lblDevice, cmbDevice, btnStartVerification, progressVerification, lblProgress, lblStatus
            });

            this.Controls.Add(grpFingerprint);
        }

        private void CreateMemberInfoControls()
        {
            grpMemberInfo = new GroupBox();
            grpMemberInfo.Text = "Member Information";
            grpMemberInfo.Location = new Point(20, 410);
            grpMemberInfo.Size = new Size(750, 200);
            grpMemberInfo.Visible = false;

            // Member photo placeholder
            picMemberPhoto = new PictureBox();
            picMemberPhoto.Location = new Point(20, 30);
            picMemberPhoto.Size = new Size(120, 150);
            picMemberPhoto.BorderStyle = BorderStyle.FixedSingle;
            picMemberPhoto.SizeMode = PictureBoxSizeMode.StretchImage;
            picMemberPhoto.BackColor = Color.LightGray;

            // Member details
            lblMemberName = new Label();
            lblMemberName.Text = "Name:";
            lblMemberName.Location = new Point(160, 30);
            lblMemberName.Size = new Size(80, 23);
            lblMemberName.Font = new Font(lblMemberName.Font, FontStyle.Bold);

            lblNameValue = new Label();
            lblNameValue.Location = new Point(250, 30);
            lblNameValue.Size = new Size(200, 23);

            lblMemberPhone = new Label();
            lblMemberPhone.Text = "Phone:";
            lblMemberPhone.Location = new Point(160, 60);
            lblMemberPhone.Size = new Size(80, 23);
            lblMemberPhone.Font = new Font(lblMemberPhone.Font, FontStyle.Bold);

            lblPhoneValue = new Label();
            lblPhoneValue.Location = new Point(250, 60);
            lblPhoneValue.Size = new Size(200, 23);

            lblMemberEmail = new Label();
            lblMemberEmail.Text = "Email:";
            lblMemberEmail.Location = new Point(160, 90);
            lblMemberEmail.Size = new Size(80, 23);
            lblMemberEmail.Font = new Font(lblMemberEmail.Font, FontStyle.Bold);

            lblEmailValue = new Label();
            lblEmailValue.Location = new Point(250, 90);
            lblEmailValue.Size = new Size(200, 23);

            lblMemberType = new Label();
            lblMemberType.Text = "Type:";
            lblMemberType.Location = new Point(160, 120);
            lblMemberType.Size = new Size(80, 23);
            lblMemberType.Font = new Font(lblMemberType.Font, FontStyle.Bold);

            lblTypeValue = new Label();
            lblTypeValue.Location = new Point(250, 120);
            lblTypeValue.Size = new Size(200, 23);

            lblMemberStatus = new Label();
            lblMemberStatus.Text = "Status:";
            lblMemberStatus.Location = new Point(160, 150);
            lblMemberStatus.Size = new Size(80, 23);
            lblMemberStatus.Font = new Font(lblMemberStatus.Font, FontStyle.Bold);

            lblStatusValue = new Label();
            lblStatusValue.Location = new Point(250, 150);
            lblStatusValue.Size = new Size(200, 23);

            grpMemberInfo.Controls.AddRange(new Control[] {
                picMemberPhoto, lblMemberName, lblNameValue, lblMemberPhone, lblPhoneValue,
                lblMemberEmail, lblEmailValue, lblMemberType, lblTypeValue, lblMemberStatus, lblStatusValue
            });

            this.Controls.Add(grpMemberInfo);
        }

        private void CreateActionButtons()
        {
            btnPrintCard = new Button();
            btnPrintCard.Text = "Print Member Card";
            btnPrintCard.Location = new Point(580, 630);
            btnPrintCard.Size = new Size(120, 35);
            btnPrintCard.BackColor = Color.FromArgb(107, 114, 128);
            btnPrintCard.ForeColor = Color.White;
            btnPrintCard.FlatStyle = FlatStyle.Flat;
            btnPrintCard.Click += BtnPrintCard_Click;
            btnPrintCard.Visible = false;

            btnClose = new Button();
            btnClose.Text = "Close";
            btnClose.Location = new Point(710, 630);
            btnClose.Size = new Size(80, 35);
            btnClose.BackColor = Color.FromArgb(239, 68, 68);
            btnClose.ForeColor = Color.White;
            btnClose.FlatStyle = FlatStyle.Flat;
            btnClose.Click += BtnClose_Click;

            this.Controls.AddRange(new Control[] { btnPrintCard, btnClose });
        }

        private async void LoadDevices()
        {
            try
            {
                var response = await _httpClient.GetStringAsync("http://localhost:8000/api/devices");
                var allDevices = JsonConvert.DeserializeObject<List<dynamic>>(response);
                _devices = allDevices.Where(d => d.status.ToString() == "online").ToList();
                
                foreach (var device in _devices)
                {
                    cmbDevice.Items.Add($"{device.name} ({device.ip_address})");
                }
                if (cmbDevice.Items.Count > 0)
                    cmbDevice.SelectedIndex = 0;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to load devices: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void RbMemberNumber_CheckedChanged(object sender, EventArgs e)
        {
            grpMemberNumber.Enabled = rbMemberNumber.Checked;
            grpFingerprint.Enabled = !rbMemberNumber.Checked;
            
            if (rbMemberNumber.Checked)
            {
                txtMemberNumber.Focus();
            }
        }

        private void RbFingerprint_CheckedChanged(object sender, EventArgs e)
        {
            grpFingerprint.Enabled = rbFingerprint.Checked;
            grpMemberNumber.Enabled = !rbFingerprint.Checked;
        }

        private void TxtMemberNumber_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (e.KeyChar == (char)Keys.Enter)
            {
                BtnSearchByNumber_Click(sender, e);
            }
        }

        private async void BtnSearchByNumber_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtMemberNumber.Text))
            {
                MessageBox.Show("Please enter a member number.", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtMemberNumber.Focus();
                return;
            }

            try
            {
                btnSearchByNumber.Enabled = false;
                btnSearchByNumber.Text = "Searching...";

                var response = await _httpClient.GetStringAsync($"http://localhost:8000/api/members?search={txtMemberNumber.Text.Trim()}");
                var members = JsonConvert.DeserializeObject<List<dynamic>>(response);

                var member = members.FirstOrDefault(m => 
                    m.member_number?.ToString() == txtMemberNumber.Text.Trim() ||
                    m.id.ToString() == txtMemberNumber.Text.Trim());

                if (member != null)
                {
                    _verifiedMember = member;
                    DisplayMemberInfo(member);
                    MessageBox.Show($"Member found: {member.name}", "Verification Successful", 
                                  MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    MessageBox.Show("Member not found. Please check the member number.", "Member Not Found", 
                                  MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error searching for member: {ex.Message}", "Error", 
                              MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                btnSearchByNumber.Enabled = true;
                btnSearchByNumber.Text = "Search Member";
            }
        }

        private async void BtnStartVerification_Click(object sender, EventArgs e)
        {
            if (cmbDevice.SelectedIndex < 0)
            {
                MessageBox.Show("Please select a device.", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                btnStartVerification.Enabled = false;
                progressVerification.Visible = true;
                progressVerification.Style = ProgressBarStyle.Marquee;
                lblProgress.Text = "Please place your finger on the scanner...";
                lblStatus.Text = "Verifying fingerprint...";
                lblStatus.ForeColor = Color.Blue;

                var selectedDevice = _devices[cmbDevice.SelectedIndex];
                var deviceIp = selectedDevice.ip_address.ToString();

                var verificationData = new
                {
                    ipAddress = deviceIp
                };

                var json = JsonConvert.SerializeObject(verificationData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("http://localhost:5000/api/fingerprint/verify", content);
                var result = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());

                if ((bool)result.success && result.memberId != null)
                {
                    // Get member information
                    var memberResponse = await _httpClient.GetStringAsync($"http://localhost:8000/api/members/{result.memberId}");
                    var member = JsonConvert.DeserializeObject<dynamic>(memberResponse);
                    
                    _verifiedMember = member;
                    DisplayMemberInfo(member);
                    
                    progressVerification.Style = ProgressBarStyle.Continuous;
                    progressVerification.Value = 100;
                    lblProgress.Text = "Fingerprint verification successful!";
                    lblStatus.Text = "Member verified successfully!";
                    lblStatus.ForeColor = Color.Green;

                    MessageBox.Show($"Member verified: {member.name}", "Verification Successful", 
                                  MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    throw new Exception("Fingerprint not recognized or member not found.");
                }
            }
            catch (Exception ex)
            {
                lblProgress.Text = "Fingerprint verification failed.";
                lblStatus.Text = $"Error: {ex.Message}";
                lblStatus.ForeColor = Color.Red;
                MessageBox.Show($"Fingerprint verification failed: {ex.Message}", "Verification Failed", 
                              MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                btnStartVerification.Enabled = true;
                progressVerification.Style = ProgressBarStyle.Continuous;
                if (progressVerification.Value != 100)
                {
                    progressVerification.Visible = false;
                }
            }
        }

        private void DisplayMemberInfo(dynamic member)
        {
            lblNameValue.Text = member.name?.ToString() ?? "N/A";
            lblPhoneValue.Text = member.phone?.ToString() ?? "N/A";
            lblEmailValue.Text = member.email?.ToString() ?? "N/A";
            lblTypeValue.Text = member.membership_type?.ToString()?.ToUpper() ?? "N/A";
            
            string status = member.status?.ToString() ?? "unknown";
            lblStatusValue.Text = status.ToUpper();
            lblStatusValue.ForeColor = status.ToLower() == "active" ? Color.Green : Color.Red;

            grpMemberInfo.Visible = true;
            btnPrintCard.Visible = true;

            // Adjust form height to show member info
            this.Height = 720;
        }

        private void BtnPrintCard_Click(object sender, EventArgs e)
        {
            if (_verifiedMember == null)
            {
                MessageBox.Show("No member information to print.", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            // Here you would implement actual printing functionality
            MessageBox.Show($"Printing member card for: {_verifiedMember.name}\n\nNote: This is a placeholder. Implement actual printing logic here.", 
                          "Print Member Card", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void BtnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _httpClient?.Dispose();
            }
            base.Dispose(disposing);
        }
    }
} 