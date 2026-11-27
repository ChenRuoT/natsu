export const inbox = {
  "settings.inbox.github.description":
    "Pull requests, reviews, and issues, read through the GitHub CLI.",
  "settings.inbox.github.connection": "Connection",
  "settings.inbox.github.connectedHelp":
    "GitHub CLI is installed and authenticated. Natsu uses it for GitHub inbox items.",
  "settings.inbox.github.signInHelp":
    "Run gh auth login in a terminal, complete the sign-in flow, then check again.",
  "settings.inbox.github.installHelp":
    "Install GitHub CLI from cli.github.com, run gh auth login in a terminal, then check again.",
  "settings.inbox.github.checking": "Checking",
  "settings.inbox.github.connected": "Connected",
  "settings.inbox.github.signInRequired": "Sign in required",
  "settings.inbox.github.notInstalled": "Not installed",
  "settings.inbox.github.installationGuide": "Installation guide",
  "settings.inbox.github.checkAgain": "Check again",

  "settings.inbox.gitlab.description":
    "Merge requests from GitLab.com or a self-managed instance.",
  "settings.inbox.gitlab.connection": "Connection",
  "settings.inbox.gitlab.connectionHelp":
    "Connect GitLab.com or a self-managed GitLab instance. Use a personal access token with API access; the token is stored locally and Disconnect deletes it.",
  "settings.inbox.gitlab.disconnect": "Disconnect",
  "settings.inbox.gitlab.urlLabel": "GitLab URL",
  "settings.inbox.gitlab.tokenLabel": "GitLab access token",
  "settings.inbox.gitlab.saving": "Saving",
  "settings.inbox.gitlab.connect": "Connect",

  "settings.inbox.azure.description":
    "Pull requests and Boards work items from your ADO organization.",
  "settings.inbox.azure.connection": "Connection",
  "settings.inbox.azure.connectionHelp":
    "Connect your ADO organization with a personal access token (Boards + Repos read & write for comments). The token is stored locally and Disconnect deletes it.",
  "settings.inbox.azure.disconnect": "Disconnect",
  "settings.inbox.azure.orgUrlLabel": "Azure DevOps organization URL",
  "settings.inbox.azure.tokenLabel": "Azure DevOps personal access token",
  "settings.inbox.azure.saving": "Saving",
  "settings.inbox.azure.connect": "Connect",

  "settings.inbox.jira.description":
    "Jira Cloud issues from the projects you pick.",
  "settings.inbox.jira.checking": "Checking Jira connection…",
  "settings.inbox.jira.connectHelp":
    "Connect your Jira Cloud site using your Atlassian email and an API token without scopes. Disconnect deletes the saved credentials.",
  "settings.inbox.jira.siteLabel": "Jira site",
  "settings.inbox.jira.emailLabel": "Atlassian email",
  "settings.inbox.jira.tokenLabel": "Jira API token",
  "settings.inbox.jira.tokenPlaceholder": "API token",
  "settings.inbox.jira.createToken": "Create API token",
  "settings.inbox.jira.disconnecting": "Disconnecting",
  "settings.inbox.jira.disconnect": "Disconnect",
  "settings.inbox.jira.connecting": "Connecting",
  "settings.inbox.jira.connect": "Connect",
  "settings.inbox.jira.projects": "Projects",
  "settings.inbox.jira.refreshProjects": "Refresh projects",
  "settings.inbox.jira.projectsHelp":
    "Unchecked projects stay out of the inbox.",

  "settings.inbox.linear.description":
    "Issues assigned to you, from the teams you pick.",
  "settings.inbox.linear.apiKey": "API key",
  "settings.inbox.linear.apiKeyHelp":
    "Create a personal API key in Linear → Settings → Security & Access. Disconnect deletes it.",
  "settings.inbox.linear.apiKeyLabel": "Linear API key",
  "settings.inbox.linear.disconnect": "Disconnect",
  "settings.inbox.linear.saving": "Saving",
  "settings.inbox.linear.connect": "Connect",
  "settings.inbox.linear.teams": "Teams",
  "settings.inbox.linear.teamsHelp": "Unchecked teams stay out of the inbox.",
} as const;
