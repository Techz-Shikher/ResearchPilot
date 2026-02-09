# ResearchPilot MySQL Database Setup Script
# Run this script in PowerShell to quickly set up the MySQL database

# Colors for output
$Success = @{ ForegroundColor = 'Green' }
$Error = @{ ForegroundColor = 'Red' }
$Info = @{ ForegroundColor = 'Cyan' }

Write-Host "`n" + "="*80 + "`n"
Write-Host "🗄️  ResearchPilot MySQL Database Setup`n" @Info
Write-Host "="*80 + "`n"

# Step 1: Check if MySQL is installed
Write-Host "📋 Step 1: Checking MySQL Installation..." @Info

$mysqlVersion = mysql --version 2>&1
if ($mysqlVersion -match "mysql") {
    Write-Host "✅ MySQL found: $mysqlVersion`n" @Success
} else {
    Write-Host "❌ MySQL is not installed or not in PATH`n" @Error
    Write-Host "Please install MySQL from: https://dev.mysql.com/downloads/mysql/`n"
    Write-Host "Or use: `choco install mysql` or `winget install MySQL.Server`"
    exit 1
}

# Step 2: Check if MySQL server is running
Write-Host "📋 Step 2: Checking if MySQL Server is Running..." @Info

$mysqlService = Get-Service MySQL* -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq 'Running' }
if ($mysqlService) {
    Write-Host "✅ MySQL Server is running ($($mysqlService.Name))`n" @Success
} else {
    Write-Host "⚠️  MySQL Server might not be running`n" @Error
    $startService = Read-Host "Would you like to start MySQL? (y/n)"
    if ($startService -eq 'y') {
        try {
            $serviceName = Get-Service MySQL* -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($serviceName) {
                Start-Service $serviceName.Name
                Start-Sleep -Seconds 2
                Write-Host "✅ MySQL Server started`n" @Success
            }
        } catch {
            Write-Host "❌ Failed to start MySQL: $_`n" @Error
        }
    }
}

# Step 3: Test MySQL connection
Write-Host "📋 Step 3: Testing MySQL Connection..." @Info

$mysqlTest = mysql -u root -e "SELECT VERSION();" 2>&1
if ($?) {
    $version = $mysqlTest | Select-Object -Last 1
    Write-Host "✅ MySQL connection successful! Version: $version`n" @Success
} else {
    Write-Host "❌ Cannot connect to MySQL with 'root' user`n" @Error
    $user = Read-Host "Enter MySQL username (default: root)"
    if ([string]::IsNullOrWhiteSpace($user)) { $user = "root" }
    
    $password = Read-Host "Enter MySQL password (press Enter if no password)"
    
    if ($password) {
        $mysqlTest = mysql -u $user -p$password -e "SELECT VERSION();" 2>&1
    } else {
        $mysqlTest = mysql -u $user -e "SELECT VERSION();" 2>&1
    }
    
    if (-not $?) {
        Write-Host "❌ Connection failed with provided credentials`n" @Error
        exit 1
    }
    Write-Host "✅ Connection successful!`n" @Success
}

# Step 4: Install Python MySQL Connector
Write-Host "📋 Step 4: Installing Python MySQL Connector..." @Info

pip list | Select-String "mysql-connector-python" | Out-Null
if ($?) {
    Write-Host "✅ mysql-connector-python is already installed`n" @Success
} else {
    Write-Host "Installing mysql-connector-python...`n"
    pip install mysql-connector-python -q
    if ($?) {
        Write-Host "✅ mysql-connector-python installed successfully`n" @Success
    } else {
        Write-Host "❌ Failed to install mysql-connector-python`n" @Error
        Write-Host "Try running: pip install mysql-connector-python`n"
        exit 1
    }
}

# Step 5: Get the script
Write-Host "📋 Step 5: Getting SQL Setup Script Path..." @Info

$scriptPath = Join-Path (Get-Location) "db_setup.sql"
if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ db_setup.sql not found in current directory`n" @Error
    Write-Host "Please make sure you're in the backend directory:`n"
    Write-Host "  cd ResearchPilot/backend`n"
    exit 1
}
Write-Host "✅ Found db_setup.sql`n" @Success

# Step 6: Create database
Write-Host "📋 Step 6: Creating MySQL Database..." @Info

$confirmCreate = Read-Host "This will create a fresh database. Continue? (y/n)"
if ($confirmCreate -ne 'y') {
    Write-Host "❌ Setup cancelled`n" @Error
    exit 0
}

try {
    # Check if we need credentials
    $testConn = mysql -u root -e "SELECT 1;" 2>&1
    if ($?) {
        mysql -u root < $scriptPath
    } else {
        $user = Read-Host "Enter MySQL username"
        $password = Read-Host "Enter MySQL password" -AsSecureString
        $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($password))
        
        if ($plainPassword) {
            mysql -u $user -p$plainPassword < $scriptPath
        } else {
            mysql -u $user < $scriptPath
        }
    }
    
    if ($?) {
        Write-Host "✅ Database created successfully!`n" @Success
    } else {
        Write-Host "❌ Error creating database`n" @Error
        exit 1
    }
} catch {
    Write-Host "❌ Error: $_`n" @Error
    exit 1
}

# Step 7: Run Python database manager
Write-Host "📋 Step 7: Verifying Database with Python..." @Info

$dbManagerPath = Join-Path (Get-Location) "db_manager.py"
if (Test-Path $dbManagerPath) {
    python $dbManagerPath
} else {
    Write-Host "⚠️  db_manager.py not found (optional step)`n"
}

# Done!
Write-Host "`n" + "="*80
Write-Host "✅ DATABASE SETUP COMPLETE!`n" @Success
Write-Host "="*80
Write-Host "`n📊 Summary:`n"
Write-Host "  • Database: research_pilot_db"
Write-Host "  • Host: localhost"
Write-Host "  • User: root"
Write-Host "`n📝 Next Steps:`n"
Write-Host "  1. Update your .env file with database credentials (if different from root)"
Write-Host "  2. Update main_enhanced.py to use MySQL instead of JSON (see MYSQL_SETUP_GUIDE.md)"
Write-Host "  3. Start your backend: python main_enhanced.py"
Write-Host "`n📚 Documentation: See MYSQL_SETUP_GUIDE.md for detailed information`n"

# Offer to show the guide
$showGuide = Read-Host "Would you like to view the setup guide? (y/n)"
if ($showGuide -eq 'y') {
    $guideFile = Join-Path (Get-Location) "MYSQL_SETUP_GUIDE.md"
    if (Test-Path $guideFile) {
        notepad $guideFile
    }
}

Write-Host "`n"
