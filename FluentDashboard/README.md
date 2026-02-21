# Fluent Dashboard

A modern dashboard built with **Blazor WebAssembly** and **[Fluent UI Blazor v5 RC1](https://github.com/microsoft/fluentui-blazor/tree/dev-v5)**.

## Features

- **Dashboard Home** — KPI cards, recent activity data grid, quick actions
- **Counter** — Interactive counter with FluentButton, progress bar, and dialog notifications
- **Weather Forecast** — Data fetching with sortable FluentDataGrid
- **Data Grid** — Full-featured employee table with search, sorting, and pagination
- **Settings** — Form controls: text inputs, switches, sliders, selects

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | [Fluent UI Blazor v5 RC1](https://www.nuget.org/packages/Microsoft.FluentUI.AspNetCore.Components/5.0.0-rc.1-26048.1) |
| Hosting model | Blazor WebAssembly (standalone) |
| Target framework | .NET 9 |
| Deployment | GitHub Pages via GitHub Actions |

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0) or later

### Run locally

```bash
cd FluentDashboard
dotnet run
```

Then open `https://localhost:5001` (or the URL shown in the terminal).

### Build for production

```bash
dotnet publish -c Release -o release
```

The output will be in `release/wwwroot/`.

## Deployment

This project is configured to auto-deploy to **GitHub Pages** on push to `main`.

### Setup

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source** and select **GitHub Actions**
3. The workflow at `.github/workflows/deploy-gh-pages.yml` handles the rest

The workflow:
- Builds and publishes the Blazor WASM app
- Adjusts `<base href>` for the repository subdirectory
- Creates a `404.html` for SPA client-side routing
- Deploys to GitHub Pages

## Project Structure

```
FluentDashboard/
├── .github/workflows/     # GitHub Actions CI/CD
├── Layout/
│   ├── MainLayout.razor   # FluentLayout with header, nav, content, footer
│   └── NavMenu.razor      # FluentNav sidebar navigation
├── Pages/
│   ├── Home.razor          # Dashboard with KPI cards & activity grid
│   ├── Counter.razor       # Interactive counter demo
│   ├── Weather.razor       # Weather forecast data grid
│   ├── DataGrid.razor      # Employee data grid with search & pagination
│   └── Settings.razor      # Settings form with various input controls
├── wwwroot/
│   ├── css/app.css         # Minimal custom styles
│   └── sample-data/        # Sample JSON data
├── App.razor               # Router component
├── Program.cs              # Service registration (AddFluentUIComponents)
└── _Imports.razor           # Global usings
```

## License

This project is for demonstration purposes.
