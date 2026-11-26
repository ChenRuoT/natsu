Unicode True
!include "MUI2.nsh"
!include "FileFunc.nsh"
Name "Natsu Native"
OutFile "@OUTFILE@"
InstallDir "$LOCALAPPDATA\Programs\Natsu Native"
InstallDirRegKey HKCU "Software\Natsu Native" "InstallDir"
RequestExecutionLevel user
SetCompressor /SOLID lzma
VIProductVersion "@WINDOWS_VERSION@"
VIAddVersionKey "ProductName" "Natsu Native"
VIAddVersionKey "FileDescription" "Natsu Native preview installer"
VIAddVersionKey "FileVersion" "@VERSION@"
!define MUI_ICON "@ICON@"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"
Var UpdatePID
Var HadPrevious
Function .onInit
  ${GetParameters} $R0
  ${GetOptions} $R0 "/UPDATEPID=" $UpdatePID
  StrCmp $UpdatePID "" ready
  System::Call 'kernel32::OpenProcess(i 0x00100000, i 0, i $UpdatePID) p .r1'
  StrCmp $1 0 ready
  System::Call 'kernel32::WaitForSingleObject(p r1, i 120000) i .r2'
  System::Call 'kernel32::CloseHandle(p r1)'
  StrCmp $2 0 ready
  Abort "Natsu Native did not close. Please try updating again."
  ready:
FunctionEnd
Section "Natsu Native"
  SetOutPath "$INSTDIR"
  ClearErrors
  File /oname=natsu-gpui.next.exe "@STAGE@\natsu-gpui.exe"
  IfErrors install_failed
  StrCpy $HadPrevious 0
  IfFileExists "$INSTDIR\natsu-gpui.exe" 0 replace_binary
  Delete "$INSTDIR\natsu-gpui.previous.exe"
  ClearErrors
  Rename "$INSTDIR\natsu-gpui.exe" "$INSTDIR\natsu-gpui.previous.exe"
  IfErrors install_failed
  StrCpy $HadPrevious 1
  replace_binary:
  ClearErrors
  Rename "$INSTDIR\natsu-gpui.next.exe" "$INSTDIR\natsu-gpui.exe"
  IfErrors rollback_binary
  File "@STAGE@\native-install.json"
  File /r "@STAGE@\licenses"
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "Software\Natsu Native" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\NatsuNative" "DisplayName" "Natsu Native"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\NatsuNative" "DisplayVersion" "@VERSION@"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\NatsuNative" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  CreateShortcut "$SMPROGRAMS\Natsu Native.lnk" "$INSTDIR\natsu-gpui.exe"
  CreateShortcut "$DESKTOP\Natsu Native.lnk" "$INSTDIR\natsu-gpui.exe"
  Delete "$INSTDIR\natsu-gpui.previous.exe"
  Goto install_done
  rollback_binary:
  StrCmp $HadPrevious 1 0 install_failed
  Rename "$INSTDIR\natsu-gpui.previous.exe" "$INSTDIR\natsu-gpui.exe"
  install_failed:
  Delete "$INSTDIR\natsu-gpui.next.exe"
  MessageBox MB_ICONSTOP "Natsu Native could not be updated. The previous executable was retained. Close other Natsu Native processes and try again."
  Abort
  install_done:
SectionEnd
Function .onInstFailed
  StrCmp $UpdatePID "" failed_done
  IfFileExists "$INSTDIR\natsu-gpui.exe" 0 failed_done
  Exec '"$INSTDIR\natsu-gpui.exe"'
  failed_done:
FunctionEnd
Function .onInstSuccess
  StrCmp $UpdatePID "" done
  Exec '"$INSTDIR\natsu-gpui.exe"'
  done:
FunctionEnd
Section "Uninstall"
  Delete "$SMPROGRAMS\Natsu Native.lnk"
  Delete "$DESKTOP\Natsu Native.lnk"
  Delete "$INSTDIR\natsu-gpui.exe"
  Delete "$INSTDIR\native-install.json"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR\licenses"
  RMDir "$INSTDIR"
  DeleteRegKey HKCU "Software\Natsu Native"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\NatsuNative"
SectionEnd
