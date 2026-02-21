# Adding a "Switch Light/Dark Theme" Button

This guide explains how to add a dark/light theme toggle button to a Blazor WebAssembly app using **Fluent UI Blazor v5**.

## How It Works

Fluent UI Blazor v5 ships a bundled JavaScript module that exposes a `Blazor.theme` object on the global scope. This object includes a `switchTheme()` function that:

1. Detects the current theme (light or dark) via the `data-theme` attribute on `<body>`.
2. Toggles to the opposite theme by swapping all Fluent UI CSS design tokens (colors, shadows, etc.).
3. Dispatches a `themeChanged` custom event on `document.body` with `{ isDark: boolean }` in the detail.

No extra JavaScript files or NuGet packages are needed — everything is built into `Microsoft.FluentUI.AspNetCore.Components`.

## Prerequisites

- Fluent UI Blazor v5 installed and configured (`AddFluentUIComponents()` in `Program.cs`)
- `<FluentProviders />` present in your layout (it renders the required web components)
- The `@using Microsoft.FluentUI.AspNetCore.Components` directive in `_Imports.razor`

## Step-by-Step

### 1. Inject `IJSRuntime` in your layout

At the top of your `MainLayout.razor`, add the JS runtime injection:

```razor
@inherits LayoutComponentBase
@inject IJSRuntime JSRuntime
```

### 2. Add the toggle button in the header

Place a `FluentButton` inside your header area. The example below uses the built-in `DarkTheme` icon and a transparent appearance so it blends with a branded header bar:

```razor
<FluentButton IconStart="@(new Icons.Regular.Size20.DarkTheme()
                              .WithColor("var(--colorNeutralForegroundOnBrand)"))"
              OnClick="@SwitchThemeAsync"
              Appearance="ButtonAppearance.Transparent"
              Title="Switch to Light/Dark theme" />
```

**Key points:**

| Property | Value | Purpose |
|---|---|---|
| `IconStart` | `Icons.Regular.Size20.DarkTheme()` | Moon/sun icon from the Fluent UI Icons package |
| `.WithColor(...)` | `"var(--colorNeutralForegroundOnBrand)"` | Ensures the icon is visible on a branded (colored) background |
| `Appearance` | `ButtonAppearance.Transparent` | No visible button chrome — icon-only look |
| `Title` | `"Switch to Light/Dark theme"` | Tooltip for accessibility |

### 3. Add the code-behind method

In the `@code` block of the same file, call the built-in JS function:

```razor
@code {
    private async Task SwitchThemeAsync()
    {
        await JSRuntime.InvokeVoidAsync("Blazor.theme.switchTheme");
    }
}
```

`Blazor.theme.switchTheme` is registered automatically by the Fluent UI Blazor v5 library module when the app starts. It returns `true` if the new theme is dark, `false` if light.

### 4. Full layout example

Here is a minimal header snippet showing the button in context:

```razor
@inherits LayoutComponentBase
@inject IJSRuntime JSRuntime

<FluentLayout>
    <FluentLayoutItem Area="@LayoutArea.Header"
                      Style="background: var(--colorBrandBackground);
                             color: var(--colorNeutralForegroundOnBrand);">
        <FluentStack VerticalAlignment="VerticalAlignment.Center"
                     Style="padding: 0 16px; height: 48px;">
            <FluentLayoutHamburger />
            <FluentText Weight="TextWeight.Bold" Size="TextSize.Size400"
                        Color="Color.Custom" CustomColor="white">
                My App
            </FluentText>

            <FluentSpacer />

            @* Theme Toggle *@
            <FluentButton IconStart="@(new Icons.Regular.Size20.DarkTheme()
                                          .WithColor("var(--colorNeutralForegroundOnBrand)"))"
                          OnClick="@SwitchThemeAsync"
                          Appearance="ButtonAppearance.Transparent"
                          Title="Switch to Light/Dark theme" />
        </FluentStack>
    </FluentLayoutItem>

    @* ... Navigation, Content, Footer ... *@
</FluentLayout>

<FluentProviders />

@code {
    private async Task SwitchThemeAsync()
    {
        await JSRuntime.InvokeVoidAsync("Blazor.theme.switchTheme");
    }
}
```

## Other Available JS Theme Helpers

The `Blazor.theme` object exposes additional utilities:

| Function | Returns | Description |
|---|---|---|
| `Blazor.theme.switchTheme()` | `boolean` | Toggles dark ↔ light; returns `true` if now dark |
| `Blazor.theme.isDarkMode()` | `boolean` | Checks if the current theme is dark |
| `Blazor.theme.isSystemDark()` | `boolean` | Checks the OS-level `prefers-color-scheme` setting |
| `Blazor.theme.setDarkTheme()` | `void` | Forces dark theme |
| `Blazor.theme.setLightTheme()` | `void` | Forces light theme |
| `Blazor.theme.setDefaultTheme()` | `void` | Applies theme based on `data-theme` attribute or OS preference |
| `Blazor.theme.switchDirection()` | `void` | Toggles LTR ↔ RTL direction |

You can call any of these from C# via `JSRuntime.InvokeVoidAsync(...)` or `JSRuntime.InvokeAsync<bool>(...)`.

## Listening for Theme Changes

The library dispatches a `themeChanged` event on `document.body` whenever the theme switches. You can listen for it in JavaScript:

```js
document.body.addEventListener("themeChanged", (e) => {
    console.log("Dark mode:", e.detail.isDark);
});
```

## Notes

- The theme state is stored via the `data-theme` attribute on `<body>` (`"dark"` or absent for light).
- All Fluent UI components automatically react to the token changes — no extra wiring needed.
- To persist the user's choice across sessions, you can read the return value of `switchTheme()` and save it to `localStorage`, then call `setDarkTheme()` or `setLightTheme()` on startup.
