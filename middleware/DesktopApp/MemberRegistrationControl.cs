using System;
using System.Drawing;
using System.Windows.Forms;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace BiometricGymSystem
{
    public partial class MemberRegistrationControl : UserControl
    {
        private GroupBox memberInfoGroup;
        private Label nameLabel;
        private TextBox nameTextBox;
        private Label emailLabel;
        private TextBox emailTextBox;
        private Label phoneLabel;
        private TextBox phoneTextBox;
        private Label membershipTypeLabel;
        private ComboBox membershipTypeComboBox;

        private GroupBox fingerprintGroup;
        private Label fingerprintStatusLabel;
        private Button captureButton;
        private ProgressBar captureProgressBar;
        private Label instructionLabel;

        private Button registerButton;
        private Button clearButton;

        private readonly HttpClient httpClient;
        private const string API_BASE_URL = "http://localhost:8000";

        public MemberRegistrationControl()
        {
            httpClient = new HttpClient();
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Size = new Size(800, 600);
            this.BackColor = Color.White;

            // 会员信息组
            memberInfoGroup = new GroupBox
            {
                Text = "会员信息",
                Location = new Point(20, 20),
                Size = new Size(350, 250),
                Font = new Font("Microsoft YaHei", 10, FontStyle.Bold)
            };

            // 姓名
            nameLabel = new Label
            {
                Text = "姓名:",
                Location = new Point(20, 30),
                Size = new Size(60, 25),
                Font = new Font("Microsoft YaHei", 9)
            };
            nameTextBox = new TextBox
            {
                Location = new Point(90, 30),
                Size = new Size(200, 25),
                Font = new Font("Microsoft YaHei", 9)
            };

            // 邮箱
            emailLabel = new Label
            {
                Text = "邮箱:",
                Location = new Point(20, 70),
                Size = new Size(60, 25),
                Font = new Font("Microsoft YaHei", 9)
            };
            emailTextBox = new TextBox
            {
                Location = new Point(90, 70),
                Size = new Size(200, 25),
                Font = new Font("Microsoft YaHei", 9)
            };

            // 电话
            phoneLabel = new Label
            {
                Text = "电话:",
                Location = new Point(20, 110),
                Size = new Size(60, 25),
                Font = new Font("Microsoft YaHei", 9)
            };
            phoneTextBox = new TextBox
            {
                Location = new Point(90, 110),
                Size = new Size(200, 25),
                Font = new Font("Microsoft YaHei", 9)
            };

            // 会员类型
            membershipTypeLabel = new Label
            {
                Text = "会员类型:",
                Location = new Point(20, 150),
                Size = new Size(60, 25),
                Font = new Font("Microsoft YaHei", 9)
            };
            membershipTypeComboBox = new ComboBox
            {
                Location = new Point(90, 150),
                Size = new Size(200, 25),
                Font = new Font("Microsoft YaHei", 9),
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            membershipTypeComboBox.Items.AddRange(new string[] { "基础会员", "高级会员", "VIP会员" });

            // 添加控件到会员信息组
            memberInfoGroup.Controls.AddRange(new Control[] {
                nameLabel, nameTextBox, emailLabel, emailTextBox,
                phoneLabel, phoneTextBox, membershipTypeLabel, membershipTypeComboBox
            });

            // 指纹录入组
            fingerprintGroup = new GroupBox
            {
                Text = "指纹录入",
                Location = new Point(400, 20),
                Size = new Size(350, 250),
                Font = new Font("Microsoft YaHei", 10, FontStyle.Bold)
            };

            fingerprintStatusLabel = new Label
            {
                Text = "请点击"录入指纹"按钮开始录入",
                Location = new Point(20, 30),
                Size = new Size(300, 25),
                Font = new Font("Microsoft YaHei", 9),
                ForeColor = Color.Blue
            };

            captureButton = new Button
            {
                Text = "录入指纹",
                Location = new Point(20, 70),
                Size = new Size(100, 35),
                Font = new Font("Microsoft YaHei", 9),
                BackColor = Color.LightBlue
            };

            captureProgressBar = new ProgressBar
            {
                Location = new Point(20, 120),
                Size = new Size(300, 20),
                Visible = false
            };

            instructionLabel = new Label
            {
                Text = "指纹录入说明：\n1. 请将手指放在指纹设备上\n2. 按照提示完成3次录入\n3. 录入成功后可进行注册",
                Location = new Point(20, 160),
                Size = new Size(300, 80),
                Font = new Font("Microsoft YaHei", 8),
                ForeColor = Color.Gray
            };

            fingerprintGroup.Controls.AddRange(new Control[] {
                fingerprintStatusLabel, captureButton, captureProgressBar, instructionLabel
            });

            // 操作按钮
            registerButton = new Button
            {
                Text = "注册会员",
                Location = new Point(400, 300),
                Size = new Size(100, 40),
                Font = new Font("Microsoft YaHei", 10, FontStyle.Bold),
                BackColor = Color.Green,
                ForeColor = Color.White,
                Enabled = false
            };

            clearButton = new Button
            {
                Text = "清空表单",
                Location = new Point(520, 300),
                Size = new Size(100, 40),
                Font = new Font("Microsoft YaHei", 10),
                BackColor = Color.Orange,
                ForeColor = Color.White
            };

            // 添加所有控件
            this.Controls.AddRange(new Control[] {
                memberInfoGroup, fingerprintGroup, registerButton, clearButton
            });

            // 绑定事件
            captureButton.Click += CaptureButton_Click;
            registerButton.Click += RegisterButton_Click;
            clearButton.Click += ClearButton_Click;
        }

        private async void CaptureButton_Click(object sender, EventArgs e)
        {
            captureButton.Enabled = false;
            captureProgressBar.Visible = true;
            captureProgressBar.Style = ProgressBarStyle.Marquee;
            fingerprintStatusLabel.Text = "正在录入指纹，请将手指放在设备上...";
            fingerprintStatusLabel.ForeColor = Color.Orange;

            try
            {
                // 模拟指纹录入过程
                await Task.Delay(3000);
                
                // 这里应该调用实际的指纹设备API
                fingerprintStatusLabel.Text = "指纹录入成功！";
                fingerprintStatusLabel.ForeColor = Color.Green;
                registerButton.Enabled = true;
            }
            catch (Exception ex)
            {
                fingerprintStatusLabel.Text = $"指纹录入失败: {ex.Message}";
                fingerprintStatusLabel.ForeColor = Color.Red;
            }
            finally
            {
                captureProgressBar.Visible = false;
                captureButton.Enabled = true;
            }
        }

        private async void RegisterButton_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(nameTextBox.Text))
            {
                MessageBox.Show("请输入会员姓名", "验证错误", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (membershipTypeComboBox.SelectedIndex == -1)
            {
                MessageBox.Show("请选择会员类型", "验证错误", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                registerButton.Enabled = false;
                
                var memberData = new
                {
                    name = nameTextBox.Text,
                    email = emailTextBox.Text,
                    phone = phoneTextBox.Text,
                    membership_type = membershipTypeComboBox.SelectedItem.ToString(),
                    is_active = true
                };

                var json = JsonConvert.SerializeObject(memberData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await httpClient.PostAsync($"{API_BASE_URL}/api/members", content);
                
                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("会员注册成功！", "成功", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    ClearForm();
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    MessageBox.Show($"注册失败: {errorContent}", "错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"注册过程中发生错误: {ex.Message}", "错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                registerButton.Enabled = true;
            }
        }

        private void ClearButton_Click(object sender, EventArgs e)
        {
            ClearForm();
        }

        private void ClearForm()
        {
            nameTextBox.Clear();
            emailTextBox.Clear();
            phoneTextBox.Clear();
            membershipTypeComboBox.SelectedIndex = -1;
            fingerprintStatusLabel.Text = "请点击"录入指纹"按钮开始录入";
            fingerprintStatusLabel.ForeColor = Color.Blue;
            registerButton.Enabled = false;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                httpClient?.Dispose();
            }
            base.Dispose(disposing);
        }
    }
} 