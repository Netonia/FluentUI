using System.Reflection;
using Icons = Microsoft.FluentUI.AspNetCore.Components.Icons;

var asm = typeof(Icons.Regular.Size20.Home).Assembly;

void ListIcons(string typeName, string filter) {
    var type = asm.GetType(typeName);
    if (type == null) { Console.WriteLine($"{typeName}: NOT FOUND"); return; }
    var icons = type.GetNestedTypes()
        .Where(t => t.Name.Contains(filter, StringComparison.OrdinalIgnoreCase))
        .OrderBy(t => t.Name).Take(20);
    foreach (var i in icons) Console.WriteLine($"  {i.Name}");
}

Console.WriteLine("--- Size20 Arrow/Trend ---");
ListIcons("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size20", "Arrow");
Console.WriteLine("--- Size20 Trend ---");
ListIcons("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size20", "Trend");
Console.WriteLine("--- Size24 Cart ---");
ListIcons("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size24", "Cart");
Console.WriteLine("--- Size24 NumberSymbol ---");
ListIcons("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size24", "NumberSymbol");
Console.WriteLine("--- Size24 Number ---");
ListIcons("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size24", "Number");
Console.WriteLine("--- Size16 exists? ---");
var s16 = asm.GetType("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size16");
Console.WriteLine(s16 != null ? "YES" : "NO");
if (s16 != null) {
    Console.WriteLine("--- Size16 Arrow ---");
    ListIcons("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size16", "Arrow");
}
Console.WriteLine("--- Size16 ArrowTrending ---");
ListIcons("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size16", "Trending");
Console.WriteLine("--- Size48 NumberSymbol ---");
var s48 = asm.GetType("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size48");
Console.WriteLine(s48 != null ? "YES" : "NO");
if (s48 != null) ListIcons("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size48", "Number");
Console.WriteLine("--- Size32 NumberSymbol ---");
var s32 = asm.GetType("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size32");
Console.WriteLine(s32 != null ? "YES" : "NO");
if (s32 != null) ListIcons("Microsoft.FluentUI.AspNetCore.Components.Icons.Regular.Size32", "Number");
