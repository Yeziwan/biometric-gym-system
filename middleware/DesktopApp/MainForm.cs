using System;
using System.Drawing;
using System.Windows.Forms;

namespace BiometricGymSystem
{
    public partial class MainForm : Form
    {
        private MenuStrip menuStrip;
        private ToolStripMenuItem memberMenuItem;
        private ToolStripMenuItem registrationMenuItem;
        private ToolStripMenuItem verificationMenuItem;
        private Panel contentPanel;
        private Label statusLabel;

        public MainForm()
        {
            InitializeComponent();
            this.Text = "生物识别健身房管理系统";
            this.Size = new Size(1000, 700);
            this.StartPosition = FormStartPosition.CenterScreen;
        }

        private void InitializeComponent()
        {
            // 创建菜单栏
            menuStrip = new MenuStrip();
            memberMenuItem = new ToolStripMenuItem("会员管理");
            registrationMenuItem = new ToolStripMenuItem("会员注册");
            verificationMenuItem = new ToolStripMenuItem("会员验证");

            // 添加菜单项
            memberMenuItem.DropDownItems.Add(registrationMenuItem);
            memberMenuItem.DropDownItems.Add(verificationMenuItem);
            menuStrip.Items.Add(memberMenuItem);

            // 创建内容面板
            contentPanel = new Panel
            {
                Dock = DockStyle.Fill,
                BackColor = Color.White
            };

            // 创建状态标签
            statusLabel = new Label
            {
                Text = "就绪",
                Dock = DockStyle.Bottom,
                Height = 30,
                BackColor = Color.LightGray,
                TextAlign = ContentAlignment.MiddleLeft,
                Padding = new Padding(10, 0, 0, 0)
            };

            // 添加控件到窗体
            this.Controls.Add(contentPanel);
            this.Controls.Add(statusLabel);
            this.Controls.Add(menuStrip);
            this.MainMenuStrip = menuStrip;

            // 绑定事件
            registrationMenuItem.Click += RegistrationMenuItem_Click;
            verificationMenuItem.Click += VerificationMenuItem_Click;

            // 默认显示欢迎界面
            ShowWelcomeScreen();
        }

        private void ShowWelcomeScreen()
        {
            contentPanel.Controls.Clear();
            
            var welcomeLabel = new Label
            {
                Text = "欢迎使用生物识别健身房管理系统\n\n请从菜单中选择功能：\n• 会员注册 - 添加新会员并录入指纹\n• 会员验证 - 验证会员身份",
                Font = new Font("Microsoft YaHei", 16, FontStyle.Regular),
                ForeColor = Color.DarkBlue,
                TextAlign = ContentAlignment.MiddleCenter,
                Dock = DockStyle.Fill
            };
            
            contentPanel.Controls.Add(welcomeLabel);
        }

        private void RegistrationMenuItem_Click(object sender, EventArgs e)
        {
            ShowMemberRegistration();
            statusLabel.Text = "会员注册模式";
        }

        private void VerificationMenuItem_Click(object sender, EventArgs e)
        {
            ShowMemberVerification();
            statusLabel.Text = "会员验证模式";
        }

        private void ShowMemberRegistration()
        {
            contentPanel.Controls.Clear();
            var registrationForm = new MemberRegistrationControl();
            registrationForm.Dock = DockStyle.Fill;
            contentPanel.Controls.Add(registrationForm);
        }

        private void ShowMemberVerification()
        {
            contentPanel.Controls.Clear();
            var verificationForm = new MemberVerificationControl();
            verificationForm.Dock = DockStyle.Fill;
            contentPanel.Controls.Add(verificationForm);
        }
    }
} 