using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Http;
using Newtonsoft.Json;
using BiometricGymSystem.Models;
using BiometricGymSystem.Controllers;

namespace BiometricGymSystem.Forms
{
    public partial class MemberRegistrationForm : Form
    {
        private readonly HttpClient _httpClient;
        private readonly DeviceController _deviceController;
        private List<Branch> _branches;
        private List<Device> _devices;
        private int? _createdMemberId;

        public MemberRegistrationForm()
        {
            InitializeComponent();
            _httpClient = new HttpClient();
            _deviceController = new DeviceController();
            LoadBranches();
            LoadDevices();
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();
            
            // Form properties
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 600);
            this.Text = "Member Registration";
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;

            // Create controls
            CreateMemberInfoControls();
            CreateFingerprintControls();
            CreateActionButtons();

            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #region Control Declarations
        private GroupBox grpMemberInfo;
        private Label lblName, lblPhone, lblEmail, lblMemberNumber, lblBranch, lblMembershipType;
        private TextBox txtName, txtPhone, txtEmail, txtMemberNumber;
        private ComboBox cmbBranch, cmbMembershipType;
        private DateTimePicker dtpStartDate, dtpEndDate;
        private Label lblStartDate, lblEndDate;

        private GroupBox grpFingerprint;
        private Label lblDevice, lblFinger, lblStatus;
        private ComboBox cmbDevice, cmbFinger;
        private Button btnStartEnrollment;
        private ProgressBar progressEnrollment;
        private Label lblProgress;

        private Button btnSaveMember, btnCancel, btnReset;
        #endregion

        private void CreateMemberInfoControls()
        {
            // Member Information Group
            grpMemberInfo = new GroupBox();
            grpMemberInfo.Text = "Member Information";
            grpMemberInfo.Location = new Point(20, 20);
            grpMemberInfo.Size = new Size(750, 280);

            // Name
            lblName = new Label();
            lblName.Text = "Full Name *:";
            lblName.Location = new Point(20, 30);
            lblName.Size = new Size(100, 23);

            txtName = new TextBox();
            txtName.Location = new Point(130, 30);
            txtName.Size = new Size(200, 23);

            // Phone
            lblPhone = new Label();
            lblPhone.Text = "Phone Number *:";
            lblPhone.Location = new Point(350, 30);
            lblPhone.Size = new Size(120, 23);

            txtPhone = new TextBox();
            txtPhone.Location = new Point(480, 30);
            txtPhone.Size = new Size(200, 23);

            // Email
            lblEmail = new Label();
            lblEmail.Text = "Email Address:";
            lblEmail.Location = new Point(20, 70);
            lblEmail.Size = new Size(100, 23);

            txtEmail = new TextBox();
            txtEmail.Location = new Point(130, 70);
            txtEmail.Size = new Size(200, 23);

            // Member Number
            lblMemberNumber = new Label();
            lblMemberNumber.Text = "Member Number:";
            lblMemberNumber.Location = new Point(350, 70);
            lblMemberNumber.Size = new Size(120, 23);

            txtMemberNumber = new TextBox();
            txtMemberNumber.Location = new Point(480, 70);
            txtMemberNumber.Size = new Size(200, 23);
            txtMemberNumber.PlaceholderText = "Auto-generated if empty";

            // Branch
            lblBranch = new Label();
            lblBranch.Text = "Branch:";
            lblBranch.Location = new Point(20, 110);
            lblBranch.Size = new Size(100, 23);

            cmbBranch = new ComboBox();
            cmbBranch.Location = new Point(130, 110);
            cmbBranch.Size = new Size(200, 23);
            cmbBranch.DropDownStyle = ComboBoxStyle.DropDownList;

            // Membership Type
            lblMembershipType = new Label();
            lblMembershipType.Text = "Membership Type:";
            lblMembershipType.Location = new Point(350, 110);
            lblMembershipType.Size = new Size(120, 23);

            cmbMembershipType = new ComboBox();
            cmbMembershipType.Location = new Point(480, 110);
            cmbMembershipType.Size = new Size(200, 23);
            cmbMembershipType.DropDownStyle = ComboBoxStyle.DropDownList;
            cmbMembershipType.Items.AddRange(new string[] { "Regular", "VIP", "Premium" });
            cmbMembershipType.SelectedIndex = 0;

            // Start Date
            lblStartDate = new Label();
            lblStartDate.Text = "Start Date:";
            lblStartDate.Location = new Point(20, 150);
            lblStartDate.Size = new Size(100, 23);

            dtpStartDate = new DateTimePicker();
            dtpStartDate.Location = new Point(130, 150);
            dtpStartDate.Size = new Size(200, 23);
            dtpStartDate.Value = DateTime.Now;

            // End Date
            lblEndDate = new Label();
            lblEndDate.Text = "End Date:";
            lblEndDate.Location = new Point(350, 150);
            lblEndDate.Size = new Size(120, 23);

            dtpEndDate = new DateTimePicker();
            dtpEndDate.Location = new Point(480, 150);
            dtpEndDate.Size = new Size(200, 23);
            dtpEndDate.Value = DateTime.Now.AddYears(1);

            // Add controls to group
            grpMemberInfo.Controls.AddRange(new Control[] {
                lblName, txtName, lblPhone, txtPhone, lblEmail, txtEmail,
                lblMemberNumber, txtMemberNumber, lblBranch, cmbBranch,
                lblMembershipType, cmbMembershipType, lblStartDate, dtpStartDate,
                lblEndDate, dtpEndDate
            });

            this.Controls.Add(grpMemberInfo);
        }

        private void CreateFingerprintControls()
        {
            // Fingerprint Group
            grpFingerprint = new GroupBox();
            grpFingerprint.Text = "Fingerprint Enrollment";
            grpFingerprint.Location = new Point(20, 320);
            grpFingerprint.Size = new Size(750, 180);

            // Device
            lblDevice = new Label();
            lblDevice.Text = "Select Device:";
            lblDevice.Location = new Point(20, 30);
            lblDevice.Size = new Size(100, 23);

            cmbDevice = new ComboBox();
            cmbDevice.Location = new Point(130, 30);
            cmbDevice.Size = new Size(250, 23);
            cmbDevice.DropDownStyle = ComboBoxStyle.DropDownList;

            // Finger
            lblFinger = new Label();
            lblFinger.Text = "Select Finger:";
            lblFinger.Location = new Point(400, 30);
            lblFinger.Size = new Size(100, 23);

            cmbFinger = new ComboBox();
            cmbFinger.Location = new Point(510, 30);
            cmbFinger.Size = new Size(150, 23);
            cmbFinger.DropDownStyle = ComboBoxStyle.DropDownList;
            for (int i = 1; i <= 10; i++)
            {
                string hand = i <= 5 ? "Right Hand" : "Left Hand";
                cmbFinger.Items.Add($"Finger {i} ({hand})");
            }
            cmbFinger.SelectedIndex = 0;

            // Start Enrollment Button
            btnStartEnrollment = new Button();
            btnStartEnrollment.Text = "Start Fingerprint Enrollment";
            btnStartEnrollment.Location = new Point(20, 70);
            btnStartEnrollment.Size = new Size(200, 35);
            btnStartEnrollment.BackColor = Color.FromArgb(59, 130, 246);
            btnStartEnrollment.ForeColor = Color.White;
            btnStartEnrollment.FlatStyle = FlatStyle.Flat;
            btnStartEnrollment.Click += BtnStartEnrollment_Click;

            // Progress Bar
            progressEnrollment = new ProgressBar();
            progressEnrollment.Location = new Point(240, 70);
            progressEnrollment.Size = new Size(300, 25);
            progressEnrollment.Visible = false;

            // Progress Label
            lblProgress = new Label();
            lblProgress.Text = "";
            lblProgress.Location = new Point(240, 100);
            lblProgress.Size = new Size(300, 23);
            lblProgress.ForeColor = Color.Blue;

            // Status Label
            lblStatus = new Label();
            lblStatus.Text = "Ready for enrollment";
            lblStatus.Location = new Point(20, 120);
            lblStatus.Size = new Size(500, 23);
            lblStatus.ForeColor = Color.Green;

            // Add controls to group
            grpFingerprint.Controls.AddRange(new Control[] {
                lblDevice, cmbDevice, lblFinger, cmbFinger,
                btnStartEnrollment, progressEnrollment, lblProgress, lblStatus
            });

            this.Controls.Add(grpFingerprint);
        }

        private void CreateActionButtons()
        {
            // Save Member Button
            btnSaveMember = new Button();
            btnSaveMember.Text = "Save Member";
            btnSaveMember.Location = new Point(450, 520);
            btnSaveMember.Size = new Size(120, 35);
            btnSaveMember.BackColor = Color.FromArgb(34, 197, 94);
            btnSaveMember.ForeColor = Color.White;
            btnSaveMember.FlatStyle = FlatStyle.Flat;
            btnSaveMember.Click += BtnSaveMember_Click;

            // Reset Button
            btnReset = new Button();
            btnReset.Text = "Reset Form";
            btnReset.Location = new Point(580, 520);
            btnReset.Size = new Size(100, 35);
            btnReset.BackColor = Color.FromArgb(107, 114, 128);
            btnReset.ForeColor = Color.White;
            btnReset.FlatStyle = FlatStyle.Flat;
            btnReset.Click += BtnReset_Click;

            // Cancel Button
            btnCancel = new Button();
            btnCancel.Text = "Cancel";
            btnCancel.Location = new Point(690, 520);
            btnCancel.Size = new Size(80, 35);
            btnCancel.BackColor = Color.FromArgb(239, 68, 68);
            btnCancel.ForeColor = Color.White;
            btnCancel.FlatStyle = FlatStyle.Flat;
            btnCancel.Click += BtnCancel_Click;

            this.Controls.AddRange(new Control[] { btnSaveMember, btnReset, btnCancel });
        }

        private async void LoadBranches()
        {
            try
            {
                var response = await _httpClient.GetStringAsync("http://localhost:8000/api/branches");
                _branches = JsonConvert.DeserializeObject<List<Branch>>(response);
                
                cmbBranch.DisplayMember = "Name";
                cmbBranch.ValueMember = "Id";
                cmbBranch.DataSource = _branches;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to load branches: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async void LoadDevices()
        {
            try
            {
                var response = await _httpClient.GetStringAsync("http://localhost:8000/api/devices");
                var allDevices = JsonConvert.DeserializeObject<List<Device>>(response);
                _devices = allDevices.Where(d => d.Status == "online").ToList();
                
                cmbDevice.DisplayMember = "Name";
                cmbDevice.ValueMember = "IpAddress";
                cmbDevice.DataSource = _devices;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to load devices: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async void BtnSaveMember_Click(object sender, EventArgs e)
        {
            if (!ValidateMemberInfo())
                return;

            try
            {
                var memberData = new
                {
                    name = txtName.Text.Trim(),
                    phone = txtPhone.Text.Trim(),
                    email = txtEmail.Text.Trim(),
                    member_number = string.IsNullOrEmpty(txtMemberNumber.Text) ? null : txtMemberNumber.Text.Trim(),
                    branch_id = (int)cmbBranch.SelectedValue,
                    membership_type = cmbMembershipType.SelectedItem.ToString().ToLower(),
                    membership_start = dtpStartDate.Value.ToString("yyyy-MM-dd"),
                    membership_end = dtpEndDate.Value.ToString("yyyy-MM-dd"),
                    status = "active"
                };

                var json = JsonConvert.SerializeObject(memberData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("http://localhost:8000/api/members", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var createdMember = JsonConvert.DeserializeObject<dynamic>(responseContent);
                    _createdMemberId = (int)createdMember.id;

                    MessageBox.Show($"Member '{txtName.Text}' has been successfully registered!\nMember ID: {_createdMemberId}", 
                                  "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    
                    btnStartEnrollment.Enabled = true;
                    lblStatus.Text = "Member saved. Ready for fingerprint enrollment.";
                    lblStatus.ForeColor = Color.Green;
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"Failed to save member: {errorContent}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error saving member: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async void BtnStartEnrollment_Click(object sender, EventArgs e)
        {
            if (!_createdMemberId.HasValue)
            {
                MessageBox.Show("Please save member information first.", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (cmbDevice.SelectedValue == null)
            {
                MessageBox.Show("Please select a device.", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                btnStartEnrollment.Enabled = false;
                progressEnrollment.Visible = true;
                progressEnrollment.Style = ProgressBarStyle.Marquee;
                lblProgress.Text = "Please place your finger on the scanner...";
                lblStatus.Text = "Enrolling fingerprint...";
                lblStatus.ForeColor = Color.Blue;

                var deviceIp = cmbDevice.SelectedValue.ToString();
                var fingerIndex = cmbFinger.SelectedIndex + 1;

                var enrollmentData = new
                {
                    ipAddress = deviceIp,
                    fingerIndex = fingerIndex
                };

                var json = JsonConvert.SerializeObject(enrollmentData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("http://localhost:5000/api/fingerprint/enroll", content);
                var result = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());

                if ((bool)result.success)
                {
                    // Save fingerprint template to database
                    await SaveFingerprintTemplate(result.templateData.ToString(), (int)result.quality, fingerIndex);
                    
                    progressEnrollment.Style = ProgressBarStyle.Continuous;
                    progressEnrollment.Value = 100;
                    lblProgress.Text = "Fingerprint enrollment completed successfully!";
                    lblStatus.Text = "Member registration completed successfully!";
                    lblStatus.ForeColor = Color.Green;

                    MessageBox.Show("Fingerprint enrollment completed successfully!", "Success", 
                                  MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    throw new Exception(result.message.ToString());
                }
            }
            catch (Exception ex)
            {
                lblProgress.Text = "Fingerprint enrollment failed.";
                lblStatus.Text = $"Error: {ex.Message}";
                lblStatus.ForeColor = Color.Red;
                MessageBox.Show($"Fingerprint enrollment failed: {ex.Message}", "Error", 
                              MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                btnStartEnrollment.Enabled = true;
                progressEnrollment.Style = ProgressBarStyle.Continuous;
                if (progressEnrollment.Value != 100)
                {
                    progressEnrollment.Visible = false;
                }
            }
        }

        private async Task SaveFingerprintTemplate(string templateData, int quality, int fingerIndex)
        {
            try
            {
                var fingerprintData = new
                {
                    member_id = _createdMemberId.Value,
                    template_data = templateData,
                    finger_index = fingerIndex,
                    quality = quality
                };

                var json = JsonConvert.SerializeObject(fingerprintData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                await _httpClient.PostAsync("http://localhost:8000/api/fingerprints", content);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to save fingerprint template: {ex.Message}", "Warning", 
                              MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private bool ValidateMemberInfo()
        {
            if (string.IsNullOrWhiteSpace(txtName.Text))
            {
                MessageBox.Show("Please enter member's full name.", "Validation Error", 
                              MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtName.Focus();
                return false;
            }

            if (string.IsNullOrWhiteSpace(txtPhone.Text))
            {
                MessageBox.Show("Please enter member's phone number.", "Validation Error", 
                              MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtPhone.Focus();
                return false;
            }

            if (cmbBranch.SelectedValue == null)
            {
                MessageBox.Show("Please select a branch.", "Validation Error", 
                              MessageBoxButtons.OK, MessageBoxIcon.Warning);
                cmbBranch.Focus();
                return false;
            }

            return true;
        }

        private void BtnReset_Click(object sender, EventArgs e)
        {
            txtName.Clear();
            txtPhone.Clear();
            txtEmail.Clear();
            txtMemberNumber.Clear();
            cmbMembershipType.SelectedIndex = 0;
            dtpStartDate.Value = DateTime.Now;
            dtpEndDate.Value = DateTime.Now.AddYears(1);
            cmbFinger.SelectedIndex = 0;
            
            progressEnrollment.Visible = false;
            progressEnrollment.Value = 0;
            lblProgress.Text = "";
            lblStatus.Text = "Ready for enrollment";
            lblStatus.ForeColor = Color.Green;
            
            _createdMemberId = null;
            btnStartEnrollment.Enabled = false;
        }

        private void BtnCancel_Click(object sender, EventArgs e)
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