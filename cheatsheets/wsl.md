1. **Basic WSL Commands**:

   -  `wsl --list` or `wsl -l`: List all installed Linux distributions.
   -  `wsl --set-version <Distro> <Version>` or `wsl -s <Distro> <Version>`: Set the WSL version for a distribution (1 or 2).
      -  Example: `wsl --set-version Ubuntu 2`
   -  `wsl --set-default-version <Version>`: Set the default WSL version for new installations.
      -  Example: `wsl --set-default-version 2`

1. **Managing Distributions**:

   -  `wsl --list --online`: List all available distributions for download from the Microsoft store. Following is example of output of the command.
      ```
      > wsl --list --online
      The following is a list of valid distributions that can be installed.
      Install using 'wsl.exe --install <Distro>'.
      NAME                                   FRIENDLY NAME
      Ubuntu                                 Ubuntu
      Debian                                 Debian GNU/Linux
      kali-linux                             Kali Linux Rolling
      Ubuntu-18.04                           Ubuntu 18.04 LTS
      Ubuntu-20.04                           Ubuntu 20.04 LTS
      Ubuntu-22.04                           Ubuntu 22.04 LTS
      OracleLinux_7_9                        Oracle Linux 7.9
      OracleLinux_8_7                        Oracle Linux 8.7
      OracleLinux_9_1                        Oracle Linux 9.1
      openSUSE-Leap-15.5                     openSUSE Leap 15.5
      SUSE-Linux-Enterprise-Server-15-SP4    SUSE Linux Enterprise Server 15 SP4
      SUSE-Linux-Enterprise-15-SP5           SUSE Linux Enterprise 15 SP5
      openSUSE-Tumbleweed                    openSUSE Tumbleweed
      ```
   -  `wsl --install -d <Distro>`: Install & start a given distribution.
      -  Example: `wsl --install -d Ubuntu`
   -  `wsl --unregister <Distro>`: Remove a distribution. This will also delete the distribution's data.
      -  Example: `wsl --unregister Ubuntu`
   -  `wsl --terminate <Distro>`: Stop or terminate a running distro.
      -  Example: `wsl --terminate Ubuntu`
   -  `wsl --distribution <Distro>` or `wsl -d <Distro>`: Start an instance of the specified distribution.
      -  Example: `wsl --distribution Ubuntu`
   -  `wsl --list --verbose` or `wsl -l -v`: List all installed distributions with detailed information.
   -  `wsl --set-default <Distro>`: Set a distribution as the default.
      -  Example: `wsl --set-default Ubuntu`
   -  `wsl --shutdown`: Terminate all running WSL instances and the VM.

1. **WSL Configuration**:

   -  `wsl --set-default-version 2`: Set the default installation version to WSL 2 for any new distributions.
   -  `wsl --set-version <Distro> 1|2` or `wsl -s <Distro> 1|2`: Set the WSL version for a distribution.
      -  Example: `wsl --set-version Ubuntu 2`

1. **Updating WSL**:

   -  To update the WSL, users should manually visit the Microsoft Store or check Windows Update for the 'Windows Subsystem for Linux Update' package.

1. **Running Commands Directly**:

   -  `wsl <command>`: Run a specific Linux command without entering the Linux shell.
      -  Example: `wsl ls`
   -  `wsl --distribution <Distro> <command>` or `wsl -d <Distro> <command>`: Run a command directly on a specific distribution.
      -  Example: `wsl --distribution Ubuntu ls`

1. **File System Access**:
   -  In Windows: Access the Linux filesystem.
      -  Path: `\\wsl$\Ubuntu`
   -  In WSL: Access the Windows file system.
      -  Paths: `/mnt/c/` for C drive, `/mnt/d/` for D drive, etc.

> Users can always refer to `wsl --help` for a detailed list of commands and options.
