using System;
using System.Windows.Forms;

namespace BiometricGymSystem
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            
            // Show splash screen or login if needed
            // For now, directly show the main form
            Application.Run(new MainForm());
        }
    }
} 