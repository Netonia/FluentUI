export var Microsoft;
(function (Microsoft) {
    var FluentUI;
    (function (FluentUI) {
        var Blazor;
        (function (Blazor) {
            var Nav;
            (function (Nav) {
                const DURATION_FAST = 150;
                const DURATION_ULTRA_SLOW = 500;
                const CURVE_DECELERATE_MID = 'cubic-bezier(0, 0, 0, 1)';
                const CURVE_ACCELERATE_MIN = 'cubic-bezier(0.8, 0, 0.78, 1)';
                function calculateDuration(itemCount, isSmallDensity) {
                    const durationPerItem = isSmallDensity ? 15 : 25;
                    const baseDuration = DURATION_FAST + itemCount * durationPerItem;
                    return Math.min(baseDuration, DURATION_ULTRA_SLOW);
                }
                function createKeyframes(height) {
                    return [
                        {
                            opacity: 0,
                            minHeight: 0,
                            height: 0
                        },
                        {
                            opacity: 1,
                            minHeight: `${height}px`,
                            height: `${height}px`
                        }
                    ];
                }
                function AnimateExpand(groupId, density = 'medium') {
                    const group = document.getElementById(groupId);
                    if (!group)
                        return;
                    group.getAnimations().forEach(anim => anim.cancel());
                    const computedStyles = window.getComputedStyle(group);
                    const isAlreadyVisible = computedStyles.overflow === 'visible';
                    if (isAlreadyVisible) {
                        group.style.height = 'auto';
                        group.style.minHeight = 'auto';
                        group.style.opacity = '1';
                        group.style.overflow = 'visible';
                        return;
                    }
                    const itemCount = group.children.length;
                    const isSmallDensity = density === 'small';
                    const targetHeight = group.scrollHeight;
                    const duration = calculateDuration(itemCount, isSmallDensity);
                    const keyframes = createKeyframes(targetHeight);
                    group.style.overflow = 'hidden';
                    const animation = group.animate(keyframes, {
                        duration: duration,
                        easing: CURVE_DECELERATE_MID,
                        fill: 'forwards'
                    });
                    animation.onfinish = () => {
                        group.style.height = 'auto';
                        group.style.minHeight = 'auto';
                        group.style.opacity = '1';
                        group.style.overflow = 'visible';
                    };
                }
                Nav.AnimateExpand = AnimateExpand;
                function AnimateCollapse(groupId, density = 'medium') {
                    return new Promise((resolve) => {
                        const group = document.getElementById(groupId);
                        if (!group) {
                            resolve();
                            return;
                        }
                        group.getAnimations().forEach(anim => anim.cancel());
                        const itemCount = group.children.length;
                        const isSmallDensity = density === 'small';
                        const currentHeight = group.scrollHeight;
                        const duration = calculateDuration(itemCount, isSmallDensity);
                        const keyframes = [...createKeyframes(currentHeight)].reverse();
                        group.style.overflow = 'hidden';
                        const animation = group.animate(keyframes, {
                            duration: duration,
                            easing: CURVE_ACCELERATE_MIN,
                            fill: 'forwards'
                        });
                        animation.onfinish = () => {
                            group.style.height = '0px';
                            group.style.minHeight = '0px';
                            group.style.opacity = '0';
                            resolve();
                        };
                    });
                }
                Nav.AnimateCollapse = AnimateCollapse;
            })(Nav = Blazor.Nav || (Blazor.Nav = {}));
        })(Blazor = FluentUI.Blazor || (FluentUI.Blazor = {}));
    })(FluentUI = Microsoft.FluentUI || (Microsoft.FluentUI = {}));
})(Microsoft || (Microsoft = {}));
