; Inno Setup Script for DevBox — Windows PHP Development Environment
; Generates DevBox_Setup_v1.0.0.exe

#define MyAppName "DevBox"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "DevBox Team"
#define MyAppURL "https://devbox.local"
#define MyAppExeName "DevBox.vbs"

[Setup]
AppId={{5A8F2B7E-7E59-4D88-B590-2D72B9743D7B}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\DevBox
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=..\release
OutputBaseFilename=DevBox_Setup_v1.0.0
SetupIconFile=..\src-tauri\icons\icon.ico
UninstallDisplayIcon={app}\icons\icon.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "startupicon"; Description: "Start DevBox automatically when Windows starts"; GroupDescription: "Windows Integration"; Flags: unchecked

[Files]
Source: "..\apps\desktop\dist\*"; DestDir: "{app}\apps\desktop\dist"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\apps\desktop\devbox-engine.cjs"; DestDir: "{app}\apps\desktop"; Flags: ignoreversion
Source: "..\runtime\manifests\*"; DestDir: "{app}\runtime\manifests"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\data\devbox-template.sqlite"; DestDir: "{app}\data"; DestName: "devbox.sqlite"; Flags: ignoreversion
Source: "..\data\*.pem"; DestDir: "{app}\data"; Flags: ignoreversion
Source: "..\src-tauri\icons\*"; DestDir: "{app}\icons"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\src-tauri\migrations\*"; DestDir: "{app}\src-tauri\migrations"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "..\scripts\*"; DestDir: "{app}\scripts"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "wscript.exe"; Parameters: """{app}\scripts\DevBox.vbs"""; WorkingDir: "{app}"; IconFilename: "{app}\icons\icon.ico"
Name: "{group}\Uninstall {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "wscript.exe"; Parameters: """{app}\scripts\DevBox.vbs"""; WorkingDir: "{app}"; IconFilename: "{app}\icons\icon.ico"; Tasks: desktopicon
Name: "{userstartup}\{#MyAppName}"; Filename: "wscript.exe"; Parameters: """{app}\scripts\DevBox.vbs"""; WorkingDir: "{app}"; IconFilename: "{app}\icons\icon.ico"; Tasks: startupicon

[Run]
Filename: "wscript.exe"; Parameters: """{app}\scripts\DevBox.vbs"""; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent
