Set WshShell = CreateObject("WScript.Shell")
Set Fso = CreateObject("Scripting.FileSystemObject")
ScriptDir = Fso.GetParentFolderName(WScript.ScriptFullName)
RootDir = Fso.GetParentFolderName(ScriptDir)
WshShell.CurrentDirectory = RootDir
WshShell.Run "cmd /c """ & ScriptDir & "\DevBox.bat""", 0, False
