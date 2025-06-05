using System;
using System.Drawing;
using System.Windows.Forms;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace BiometricGymSystem
{
    public partial class MemberVerificationControl : UserControl
    {
        private GroupBox verificationMethodGroup;
        private RadioButton memberIdRadio;
        private RadioButton fingerprintRadio;

        private GroupBox memberIdGroup;
        private Label memberIdLabel;
        private TextBox memberIdTextBox;
        private Button verifyByIdButton;

        private GroupBox fingerprintGroup;
        private Label fingerprintStatusLabel;
        private Button verifyByFingerprintButton;
        private ProgressBar verificationProgressBar;
        private Label instructionLabel;

        private GroupBox resultGroup;
        private Label resultLabel;
        private Label memberInfoLabel;

        private Button clearButton;

        private readonly HttpClient httpClient;
        private const string API_BASE_URL = "http://localhost:8000";

        public MemberVerificationControl()
        {
            httpClient = new HttpClient();
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Size = new Size(800, 600);
            this.BackColor = Color.White;

            // 验证方式选择组
            verificationMethodGroup = new GroupBox
            {
                Text = "验证方式",
                Location = new Point(20, 20),
                Size = new Size(350, 80),
                Font = new Font("Microsoft YaHei", 10, FontStyle.Bold)
            };

            memberIdRadio = new RadioButton
            {
                Text = "会员编号验证",
                Location = new Point(20, 25),
                Size = new Size(120, 25),
                Font = new Font("Microsoft YaHei", 9),
                Checked = true
            };

            fingerprintRadio = new RadioButton
            {
                Text = "指纹验证",
                Location = new Point(160, 25),
                Size = new Size(100, 25),
                Font = new Font("Microsoft YaHei", 9)
            };

            verificationMethodGroup.Controls.AddRange(new Control[] {
                memberIdRadio, fingerprintRadio
            });

            // 会员编号验证组
            memberIdGroup = new GroupBox
            {
                Text = "会员编号验证",
                Location = new Point(20, 120),
                Size = new Size(350, 120),
                Font = new Font("Microsoft YaHei", 10, FontStyle.Bold)
            };

            memberIdLabel = new Label
            {
                Text = "会员编号:",
                Location = new Point(20, 30),
                Size = new Size(80, 25),
                Font = new Font("Microsoft YaHei", 9)
            };

            memberIdTextBox = new TextBox
            {
                Location = new Point(110, 30),
                Size = new Size(150, 25),
                Font = new Font("Microsoft YaHei", 9)
            };

            verifyByIdButton = new Button
            {
                Text = "验证",
                Location = new Point(270, 30),
                Size = new Size(60, 25),
                Font = new Font("Microsoft YaHei", 9),
                BackColor = Color.LightBlue
            };

            memberIdGroup.Controls.AddRange(new Control[] {
                memberIdLabel, memberIdTextBox, verifyByIdButton
            });

            // 指纹验证组
            fingerprintGroup = new GroupBox
            {
                Text = "指纹验证",
                Location = new Point(20, 260),
                Size = new Size(350, 150),
                Font = new Font("Microsoft YaHei", 10, FontStyle.Bold),
                Enabled = false
            };

            fingerprintStatusLabel = new Label
            {
                Text = "请点击验证按钮开始指纹验证",
                Location = new Point(20, 30),
                Size = new Size(300, 25),
                Font = new Font("Microsoft YaHei", 9),
                ForeColor = Color.Blue
            };

            verifyByFingerprintButton = new Button
            {
                Text = "指纹验证",
                Location = new Point(20, 60),
                Size = new Size(100, 35),
                Font = new Font("Microsoft YaHei", 9),
                BackColor = Color.LightGreen
            };

            verificationProgressBar = new ProgressBar
            {
                Location = new Point(20, 100),
                Size = new Size(300, 20),
                Visible = false
            };

            instructionLabel = new Label
            {
                Text = "指纹验证说明：\n1. 点击"指纹验证"按钮\n2. 将手指放在设备上进行验证",
                Location = new Point(140, 60),
                Size = new Size(200, 60),
                Font = new Font("Microsoft YaHei", 8),
                ForeColor = Color.Gray
            };

            fingerprintGroup.Controls.AddRange(new Control[] {
                fingerprintStatusLabel, verifyByFingerprintButton,
                verificationProgressBar, instructionLabel
            });

            // 验证结果组
            resultGroup = new GroupBox
            {
                Text = "验证结果",
                Location = new Point(400, 20),
                Size = new Size(350, 390),
                Font = new Font("Microsoft YaHei", 10, FontStyle.Bold)
            };

            resultLabel = new Label
            {
                Text = "等待验证...",
                Location = new Point(20, 30),
                Size = new Size(300, 30),
                Font = new Font("Microsoft YaHei", 12, FontStyle.Bold),
                ForeColor = Color.Gray,
                TextAlign = ContentAlignment.MiddleCenter
            };

            memberInfoLabel = new Label
            {
                Text = "",
                Location = new Point(20, 80),
                Size = new Size(300, 280),
                Font = new Font("Microsoft YaHei", 9),
                ForeColor = Color.Black
            };

            resultGroup.Controls.AddRange(new Control[] {
                resultLabel, memberInfoLabel
            });

            // 清空按钮
            clearButton = new Button
            {
                Text = "清空结果",
                Location = new Point(650, 430),
                Size = new Size(100, 40),
                Font = new Font("Microsoft YaHei", 10),
                BackColor = Color.Orange,
                ForeColor = Color.White
            };

            // 添加所有控件
            this.Controls.AddRange(new Control[] {
                verificationMethodGroup, memberIdGroup, fingerprintGroup,
                resultGroup, clearButton
            });

            // 绑定事件
            memberIdRadio.CheckedChanged += VerificationMethod_CheckedChanged;
            fingerprintRadio.CheckedChanged += VerificationMethod_CheckedChanged;
            verifyByIdButton.Click += VerifyByIdButton_Click;
            verifyByFingerprintButton.Click += VerifyByFingerprintButton_Click;
            clearButton.Click += ClearButton_Click;
            memberIdTextBox.KeyPress += MemberIdTextBox_KeyPress;
        }

        private void VerificationMethod_CheckedChanged(object sender, EventArgs e)
        {
            memberIdGroup.Enabled = memberIdRadio.Checked;
            fingerprintGroup.Enabled = fingerprintRadio.Checked;
        }

        private async void VerifyByIdButton_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(memberIdTextBox.Text))
            {
                MessageBox.Show("请输入会员编号", "验证错误", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                verifyByIdButton.Enabled = false;
                resultLabel.Text = "正在验证...";
                resultLabel.ForeColor = Color.Orange;

                var response = await httpClient.GetAsync($"{API_BASE_URL}/api/members/{memberIdTextBox.Text}");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var member = JsonConvert.DeserializeObject<dynamic>(content);
                    
                    ShowVerificationSuccess(member);
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    ShowVerificationFailure("会员编号不存在");
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    ShowVerificationFailure($"验证失败: {errorContent}");
                }
            }
            catch (Exception ex)
            {
                ShowVerificationFailure($"验证过程中发生错误: {ex.Message}");
            }
            finally
            {
                verifyByIdButton.Enabled = true;
            }
        }

        private async void VerifyByFingerprintButton_Click(object sender, EventArgs e)
        {
            try
            {
                verifyByFingerprintButton.Enabled = false;
                verificationProgressBar.Visible = true;
                verificationProgressBar.Style = ProgressBarStyle.Marquee;
                fingerprintStatusLabel.Text = "正在进行指纹验证，请将手指放在设备上...";
                fingerprintStatusLabel.ForeColor = Color.Orange;
                resultLabel.Text = "正在验证...";
                resultLabel.ForeColor = Color.Orange;

                // 模拟指纹验证过程
                await Task.Delay(3000);
                
                // 这里应该调用实际的指纹验证API
                // 暂时模拟成功并返回会员信息
                var mockMember = new
                {
                    id = 1,
                    name = "张三",
                    email = "zhangsan@example.com",
                    phone = "13800138000",
                    membership_type = "VIP会员",
                    is_active = true,
                    created_at = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                };

                ShowVerificationSuccess(mockMember);
                fingerprintStatusLabel.Text = "指纹验证成功！";
                fingerprintStatusLabel.ForeColor = Color.Green;
            }
            catch (Exception ex)
            {
                ShowVerificationFailure($"指纹验证失败: {ex.Message}");
                fingerprintStatusLabel.Text = "指纹验证失败";
                fingerprintStatusLabel.ForeColor = Color.Red;
            }
            finally
            {
                verificationProgressBar.Visible = false;
                verifyByFingerprintButton.Enabled = true;
            }
        }

        private void ShowVerificationSuccess(dynamic member)
        {
            resultLabel.Text = "✓ 验证成功";
            resultLabel.ForeColor = Color.Green;

            memberInfoLabel.Text = $"会员信息：\n\n" +
                                 $"编号: {member.id}\n" +
                                 $"姓名: {member.name}\n" +
                                 $"邮箱: {member.email ?? "未设置"}\n" +
                                 $"电话: {member.phone ?? "未设置"}\n" +
                                 $"会员类型: {member.membership_type}\n" +
                                 $"状态: {(member.is_active == true ? "活跃" : "非活跃")}\n" +
                                 $"注册时间: {member.created_at}";
        }

        private void ShowVerificationFailure(string message)
        {
            resultLabel.Text = "✗ 验证失败";
            resultLabel.ForeColor = Color.Red;
            memberInfoLabel.Text = message;
        }

        private void ClearButton_Click(object sender, EventArgs e)
        {
            memberIdTextBox.Clear();
            resultLabel.Text = "等待验证...";
            resultLabel.ForeColor = Color.Gray;
            memberInfoLabel.Text = "";
            fingerprintStatusLabel.Text = "请点击验证按钮开始指纹验证";
            fingerprintStatusLabel.ForeColor = Color.Blue;
        }

        private void MemberIdTextBox_KeyPress(object sender, KeyPressEventArgs e)
        {
            // 只允许输入数字
            if (!char.IsControl(e.KeyChar) && !char.IsDigit(e.KeyChar))
            {
                e.Handled = true;
            }

            // 按回车键时自动验证
            if (e.KeyChar == (char)Keys.Enter)
            {
                VerifyByIdButton_Click(sender, EventArgs.Empty);
            }
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