1. **Basic Winget Commands**:

   -  `winget install <PackageName>`: Install a specific package.
      -  Example: `winget install Microsoft.VisualStudioCode`
   -  `winget show <PackageName>`: Display information about a specific package.
      -  Example: `winget show Microsoft.VisualStudioCode`
   -  `winget list`: List all installed packages.
   -  `winget list <Query>`: List all installed packages that match the query.
      -  Example: `winget list VisualStudioCode`
   -  `winget search <Query>`: Search for a package.
      -  Example: `winget search VisualStudioCode`
   -  `winget upgrade`: List all available upgrades for installed packages.
   -  `winget upgrade <PackageName>`: Upgrade a specific package to the latest version.
      -  Example: `winget upgrade Microsoft.VisualStudioCode`
   -  `winget uninstall <PackageName>`: Uninstall a specific package.
      -  Example: `winget uninstall Microsoft.VisualStudioCode`
   -  `winget source list`: List all configured sources for packages.
   -  `winget source update`: Update the data for all sources.
   -  `winget --version` or `winget -v`: Display the version of the winget client.
   -  `winget upgrade --include-unknown --all --uninstall-previous`: Upgrade all installed packages, even if they were not installed by `winget`, and uninstall the previous versions after the upgrade.

      > The `--include-unknown` flag allows `winget` to upgrade packages that were not originally installed by `winget`. The `--all` flag indicates that all installed packages should be upgraded. The `--uninstall-previous` flag ensures that the previous versions of the packages are uninstalled after the upgrade.

> Users can always refer to `winget --help` for a detailed list of commands and options.
