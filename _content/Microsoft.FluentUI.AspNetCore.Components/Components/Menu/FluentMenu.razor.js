export var Microsoft;
(function (Microsoft) {
    var FluentUI;
    (function (FluentUI) {
        var Blazor;
        (function (Blazor) {
            var Menu;
            (function (Menu) {
                function Initialize(id, triggerId) {
                    const trigger = document.getElementById(triggerId);
                    if (trigger) {
                        trigger.style["anchor-name"] = `--anchor-${triggerId}`;
                        const menu = document.getElementById(id);
                        if (menu && menu.slottedMenuList.length) {
                            menu.slottedTriggers.push(trigger);
                            menu.slottedMenuList[0].style["position-anchor"] = `--anchor-${triggerId}`;
                            menu.setComponent();
                        }
                    }
                }
                Menu.Initialize = Initialize;
                function CloseMenu(id) {
                    const menu = document.getElementById(id);
                    if (menu) {
                        menu.closeMenu();
                    }
                }
                Menu.CloseMenu = CloseMenu;
                function OpenMenu(id) {
                    const menu = document.getElementById(id);
                    if (menu) {
                        menu.openMenu();
                    }
                }
                Menu.OpenMenu = OpenMenu;
            })(Menu = Blazor.Menu || (Blazor.Menu = {}));
        })(Blazor = FluentUI.Blazor || (FluentUI.Blazor = {}));
    })(FluentUI = Microsoft.FluentUI || (Microsoft.FluentUI = {}));
})(Microsoft || (Microsoft = {}));
