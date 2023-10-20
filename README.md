> Some cheatsheets are available for convenience
>
> -  [Windows package manager a.k.a winget](./cheatsheets/winget.md)
> -  [WSL](./cheatsheets/wsl.md)
> -  [Docker](./cheatsheets/docker.md)

# Setup

1. Familiarize yourself with the [winget](https://learn.microsoft.com/en-us/windows/package-manager/) package manager and [WSL](https://learn.microsoft.com/en-us/windows/wsl/) if you're using Windows.

1. Ensure `git` is installed and authentication is set up. For beginners, [Git Credential Manager](https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git) is recommended.

   To install on Windows:

   ```
   winget install Git.Git
   ```

1. Install VSCode and the essential extensions listed below.

   To install on Windows:

   ```
   winget install Microsoft.VisualStudioCode
   ```

   **Extensions to install**:

   -  Dev Containers
   -  WSL (only for Windows users)

1. Install [Docker desktop](https://www.docker.com/products/docker-desktop/) or [Docker engine](https://docs.docker.com/engine/install/).

1. **For Windows users only**:

   -  Install the latest versions of [Terminal](https://learn.microsoft.com/en-au/windows/terminal/) and [PowerShell](https://learn.microsoft.com/en-us/powershell/).

      ```
      winget install Microsoft.WindowsTerminal
      winget install Microsoft.PowerShell
      ```

   -  Get acquainted with WSL and using Ubuntu on Windows. All development should be done inside Ubuntu, not Windows. Check out this [video](https://www.youtube.com/watch?v=LktFP0Dpl-c) for a clearer understanding.

   -  Install WSL2 or upgrade from WSL1 to WSL2 using these [instructions](https://learn.microsoft.com/en-us/windows/wsl/install).

   -  Set WSL2 as the default:

      ```
      wsl --set-default-version 2
      ```

   -  Install and start Ubuntu:

      ```
      wsl --install -d Ubuntu
      ```

      > Remember the password you set when starting Ubuntu for the first time.

   -  Exit and stop Ubuntu to enable Docker integration:

      ```
      wsl --terminate Ubuntu
      ```

   -  Ensure Docker uses the `WSL 2 based engine` and that `WSL integration` is enabled for Ubuntu in Docker settings. Learn more [here](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers).

   -  Restart the Ubuntu distro:

      ```
      wsl --distribution Ubuntu
      ```

      After starting Ubuntu, verify the Docker command works:

      ```
      docker container ls
      ```

   -  Regularly update Ubuntu:

      ```
      sudo apt update
      sudo apt upgrade -y
      ```

   -  Set up git authentication in Ubuntu:

      > Replace the placeholders with your information.

      ```
      git config --global user.name "Your Name"
      git config --global user.email "youremail@domain.com"
      ```

      If using Git Credential Manager:

      ```
      git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe"
      ```

      Otherwise, copy your SSH keys into Ubuntu.

   -  Consider using [Oh My Posh](https://ohmyposh.dev/) for `PowerShell` and [Z shell](https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH) with [oh my zsh](https://ohmyz.sh/) for `Ubuntu WSL`.

1. Now, let's check out our code. For Windows users, do this inside **Ubuntu**:

   ```
   cd ~
   mkdir -p github/ibrahim
   git clone https://github.com/mitayyab/micro-notes.git
   ```

1. Create the necessary environment variable files (.env files) required by the docker-compose command. You can either create these manually or use the provided script:

   ```
   chmod +x .devcontainer/create-envs.sh
   .devcontainer/create-envs.sh
   ```

1. To manually create the .env file with the following content in the project's root directory:

   > Use `openssl` to generate passwords. The following command creates a 24-character secret. Both the `micro-notes` container and `Ubuntu WSL` come with `openssl` pre-installed:

   ```
   openssl rand -base64 24
   ```

   > Replace the placeholder with your value:

   ```
   COMPOSE_PROJECT_NAME=micro-notes
   MONGO_ROOT_USERNAME=root
   MONGO_ROOT_PASSWORD=<Your own password>
   MONGO_NOTES_PASSWORD=notes
   BACKEND_PORT=8081
   ```

1. For backend environment files, follow the instructions in [./backend/README.md](./backend/README.md).

1. If using Docker Desktop, ensure it's running. Remove all the containers, images & volumes related to the project.

   ```
   docker compose down --volumes --rmi all
   ```

   If you are migrating from existing multi-repo setup, just remove all the containers.

   ```
   docker stop $(docker ps -aq)
   docker system prune -a
   ```

1. Now, let's set up the development environment:

   ```
   cd ~\github\ibrahim\micro-notes
   code .
   ```

   For Windows users: This command installs the VS Code server, starts VS Code on Windows, and connects it to the VS Code server inside Ubuntu.

1. In VS Code, open the command palette (`Show All Commands`), type `dev con:

`, and select `Rebuild and Reopen in Container`.

    This action fetches and starts the containers. You might see a `Jest` plugin error; ignore it for now. Dependencies are still being installed.

    View the log using the following command or through `Docker Desktop`. Wait until you see `Ready for development`:

    ```
    docker logs micro-notes
    ```

1. Verify that the Jest plugin runs tests successfully.

1. In the dev container, open the workspace file using `File > Open Workspace from File...`. The workspace file is at `/micro-notes/project.code-workspace`. If prompted to rebuild, do so.

1. In `VS Code`, select `Run and Debug` from the `Primary Side Bar`. You'll see the following available targets:

   -  `Frontend dev server`: Runs the frontend development server.
   -  `Backend dev server`: Runs the backend express server in debug/development mode.

1. Install the extensions recommended by the workspace.

> Note: When you close `VS Code`, the containers stop automatically. Ensure the containers are stopped before relaunching `VS Code`. Wait for the startup script to finish, which displays `Ready for development` at the end.
