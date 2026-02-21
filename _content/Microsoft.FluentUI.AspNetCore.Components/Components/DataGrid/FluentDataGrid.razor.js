export var Microsoft;
(function (Microsoft) {
    var FluentUI;
    (function (FluentUI) {
        var Blazor;
        (function (Blazor) {
            var DataGrid;
            (function (DataGrid) {
                let grids = [];
                function Initialize(gridElement, autoFocus) {
                    if (gridElement === undefined || gridElement === null) {
                        return;
                    }
                    const controller = new AbortController();
                    const { signal } = controller;
                    EnableColumnResizing(gridElement, true, signal);
                    let start = gridElement.querySelector('td:first-child');
                    if (autoFocus && start) {
                        start.focus();
                    }
                    const bodyClickHandler = (event) => {
                        const columnOptionsElement = gridElement?.querySelector('.col-options');
                        if (columnOptionsElement && event.composedPath().indexOf(columnOptionsElement) < 0) {
                            gridElement.dispatchEvent(new CustomEvent('closecolumnoptions', { bubbles: true }));
                        }
                        const columnResizeElement = gridElement?.querySelector('.col-resize');
                        if (columnResizeElement && event.composedPath().indexOf(columnResizeElement) < 0) {
                            gridElement.dispatchEvent(new CustomEvent('closecolumnresize', { bubbles: true }));
                        }
                    };
                    const bodyKeyDownHandler = (event) => {
                        if (event.key === "Escape") {
                            const columnOptionsElement = gridElement?.querySelector('.col-options');
                            if (columnOptionsElement) {
                                gridElement.dispatchEvent(new CustomEvent('closecolumnoptions', { bubbles: true }));
                                gridElement.focus();
                            }
                            const columnResizeElement = gridElement?.querySelector('.col-resize');
                            if (columnResizeElement) {
                                gridElement.dispatchEvent(new CustomEvent('closecolumnresize', { bubbles: true }));
                                gridElement.focus();
                            }
                        }
                    };
                    const keyboardNavigation = (sibling) => {
                        if (sibling !== null) {
                            if (start)
                                start.focus();
                            sibling.focus();
                            start = sibling;
                        }
                    };
                    const keyDownHandler = (event) => {
                        const columnOptionsElement = gridElement?.querySelector('.col-options');
                        if (columnOptionsElement && columnOptionsElement.contains(event.target)) {
                            if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "ArrowUp") {
                                event.stopPropagation();
                                return;
                            }
                        }
                        const columnResizeElement = gridElement?.querySelector('.col-resize');
                        if (columnResizeElement && columnResizeElement.contains(event.target)) {
                            if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "ArrowUp") {
                                event.stopPropagation();
                                return;
                            }
                        }
                        if (document.activeElement?.tagName.toLowerCase() != 'table' && document.activeElement?.tagName.toLowerCase() != 'td' && document.activeElement?.tagName.toLowerCase() != 'th') {
                            return;
                        }
                        if (event.target.getAttribute('role') !== "gridcell" && (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "ArrowUp")) {
                            return;
                        }
                        if (start !== null && (gridElement.contains(start) || gridElement === start) && document.activeElement === start && document.activeElement.tagName.toLowerCase() !== 'fluent-text-field' && document.activeElement.tagName.toLowerCase() !== 'fluent-menu-item') {
                            const idx = start.cellIndex;
                            const isRTL = getComputedStyle(gridElement).direction === 'rtl';
                            if (event.key === "ArrowUp") {
                                const previousRow = start.parentElement?.previousElementSibling;
                                if (previousRow !== null) {
                                    event.preventDefault();
                                    const previousSibling = previousRow.cells[idx];
                                    keyboardNavigation(previousSibling);
                                }
                            }
                            else if (event.key === "ArrowDown") {
                                const nextRow = start.parentElement?.nextElementSibling;
                                if (nextRow !== null) {
                                    event.preventDefault();
                                    const nextSibling = nextRow.cells[idx];
                                    keyboardNavigation(nextSibling);
                                }
                            }
                            else if (event.key === "ArrowLeft") {
                                event.preventDefault();
                                const previousSibling = isRTL ? start.nextElementSibling : start.previousElementSibling;
                                keyboardNavigation(previousSibling);
                                event.stopPropagation();
                            }
                            else if (event.key === "ArrowRight") {
                                event.preventDefault();
                                const nextsibling = isRTL ? start.previousElementSibling : start.nextElementSibling;
                                keyboardNavigation(nextsibling);
                                event.stopPropagation();
                            }
                        }
                        else {
                            start = document.activeElement;
                        }
                    };
                    const cells = gridElement.querySelectorAll('[role="gridcell"]');
                    cells.forEach((cell) => {
                        cell.columnDefinition = {
                            columnDataKey: "",
                            cellInternalFocusQueue: true,
                            cellFocusTargetCallback: (cell) => {
                                return cell.children[0];
                            }
                        };
                        cell.addEventListener("keydown", (event) => {
                            if (event.target.role !== "gridcell" && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
                                event.stopPropagation();
                            }
                        }, { signal });
                    });
                    document.body.addEventListener('click', bodyClickHandler, { signal });
                    document.body.addEventListener('mousedown', bodyClickHandler, { signal });
                    document.body.addEventListener('keydown', bodyKeyDownHandler, { signal });
                    gridElement.addEventListener('keydown', keyDownHandler, { signal });
                    return {
                        stop: () => {
                            controller.abort();
                            const grid = grids.find(g => g.id === gridElement.id);
                            if (grid?.resizeController) {
                                grid.resizeController.abort();
                            }
                            grids = grids.filter(grid => grid.id !== gridElement.id);
                        }
                    };
                }
                DataGrid.Initialize = Initialize;
                function CheckColumnPopupPosition(gridElement, selector) {
                    const colPopup = gridElement.querySelector(selector);
                    if (colPopup) {
                        const gridRect = gridElement.getBoundingClientRect();
                        const popupRect = colPopup.getBoundingClientRect();
                        const leftOverhang = Math.max(0, gridRect.left - popupRect.left);
                        const rightOverhang = Math.max(0, popupRect.right - gridRect.right);
                        if (leftOverhang || rightOverhang) {
                            const applyOffset = leftOverhang && rightOverhang ? (leftOverhang - rightOverhang) / 2 : (leftOverhang - rightOverhang);
                            colPopup.style.transform = `translateX(${applyOffset}px)`;
                        }
                        colPopup.style.visibility = 'visible';
                        colPopup.scrollIntoViewIfNeeded?.();
                        const autoFocusElem = colPopup.querySelector('[autofocus]');
                        if (autoFocusElem) {
                            autoFocusElem.focus();
                        }
                    }
                }
                DataGrid.CheckColumnPopupPosition = CheckColumnPopupPosition;
                function EnableColumnResizing(gridElement, resizeColumnOnAllRows = true, signal) {
                    const columns = [];
                    const headers = gridElement.querySelectorAll('.column-header.resizable');
                    if (headers.length === 0) {
                        return;
                    }
                    const id = gridElement.id;
                    let grid = grids.find((g) => g.id === id);
                    if (grid?.resizeController) {
                        grid.resizeController.abort();
                    }
                    const localController = new AbortController();
                    const effectiveSignal = signal ?? localController.signal;
                    const isGrid = gridElement.classList.contains('grid');
                    let tableHeight = gridElement.offsetHeight;
                    if (tableHeight < 70) {
                        const rowCount = gridElement.getAttribute('aria-rowcount');
                        if (rowCount) {
                            const rowHeight = gridElement.querySelector('thead tr th')?.offsetHeight;
                            tableHeight = Number(rowCount) * rowHeight;
                        }
                    }
                    let resizeHandleHeight = tableHeight;
                    if (!resizeColumnOnAllRows) {
                        resizeHandleHeight = headers.length > 0 ? (headers[0].offsetHeight - 14) : 30;
                    }
                    headers.forEach((header) => {
                        columns.push({
                            header,
                            size: `${isGrid ? header.offsetWidth : header.clientWidth}px`,
                        });
                        const resizedivs = header.querySelectorAll('.actual-resize-handle');
                        resizedivs.forEach(div => div.remove());
                        const resizeTop = header.querySelector('.resize-handle')?.offsetTop ?? 2;
                        const div = createDiv(resizeHandleHeight, resizeTop);
                        header.appendChild(div);
                        setListeners(div, effectiveSignal);
                    });
                    let initialWidths;
                    if (gridElement.style.gridTemplateColumns) {
                        initialWidths = gridElement.style.gridTemplateColumns;
                    }
                    else {
                        initialWidths = columns.map(({ size }) => size).join(' ');
                        if (isGrid) {
                            gridElement.style.gridTemplateColumns = initialWidths;
                        }
                    }
                    if (!grid) {
                        grids.push({
                            id,
                            columns,
                            initialWidths,
                            resizeController: signal ? undefined : localController,
                        });
                    }
                    else {
                        const columnsChanged = grid.columns.length !== columns.length;
                        grid.columns = columns;
                        if (columnsChanged) {
                            grid.initialWidths = initialWidths;
                        }
                        grid.resizeController = signal ? undefined : localController;
                    }
                    function setListeners(div, signal) {
                        let pageX, curCol, curColWidth;
                        const moveHandler = (e) => {
                            requestAnimationFrame(() => {
                                gridElement.style.tableLayout = 'fixed';
                                if (curCol) {
                                    const isRTL = getComputedStyle(gridElement).direction === 'rtl';
                                    const diffX = isRTL ? (pageX - e.pageX) : (e.pageX - pageX);
                                    const column = columns.find(({ header }) => header === curCol);
                                    const minWidth = parseInt(column.header.style.minWidth) || 0;
                                    column.size = Math.max(minWidth, curColWidth + diffX) + 'px';
                                    columns.forEach((col) => {
                                        if (col.size.startsWith('minmax')) {
                                            col.size = (isGrid ? column.header.offsetWidth : col.header.clientWidth) + 'px';
                                        }
                                    });
                                    if (isGrid) {
                                        gridElement.style.gridTemplateColumns = columns
                                            .map(({ size }) => size)
                                            .join(' ');
                                    }
                                    else {
                                        curCol.style.width = column.size;
                                    }
                                }
                            });
                        };
                        const upHandler = function () {
                            gridElement.removeEventListener('pointermove', moveHandler);
                            gridElement.removeEventListener('pointerup', upHandler);
                            gridElement.removeEventListener('pointerleave', upHandler);
                            gridElement.removeEventListener('pointercancel', upHandler);
                            curCol = undefined;
                            curColWidth = undefined;
                            pageX = undefined;
                        };
                        div.addEventListener('pointerdown', function (e) {
                            curCol = e.target.parentElement;
                            pageX = e.pageX;
                            const isGrid = gridElement.classList.contains('grid');
                            const padding = isGrid ? 0 : paddingDiff(curCol);
                            curColWidth = curCol.offsetWidth - padding;
                            gridElement.addEventListener('pointermove', moveHandler, { signal });
                            gridElement.addEventListener('pointerup', upHandler, { signal });
                            gridElement.addEventListener('pointerleave', upHandler, { signal });
                            gridElement.addEventListener('pointercancel', upHandler, { signal });
                        }, { signal });
                        div.addEventListener('pointerover', function (e) {
                            e.target.style.borderInlineEnd = 'var(--fluent-data-grid-resize-handle-width) solid var(--fluent-data-grid-resize-handle-color)';
                            if (e.target.previousElementSibling) {
                                e.target.previousElementSibling.style.visibility = 'hidden';
                            }
                        }, { signal });
                        div.addEventListener('pointerup', removeBorder, { signal });
                        div.addEventListener('pointercancel', removeBorder, { signal });
                        div.addEventListener('pointerleave', removeBorder, { signal });
                    }
                    function createDiv(height, top) {
                        const div = document.createElement('div');
                        div.className = 'actual-resize-handle';
                        div.style.top = top + 'px';
                        div.style.position = 'absolute';
                        div.style.cursor = 'col-resize';
                        div.style.userSelect = 'none';
                        div.style.height = (height - 4) + 'px';
                        div.style.width = '6px';
                        div.style.opacity = 'var(--fluent-data-grid-header-opacity)';
                        div.style.insetInlineEnd = '0';
                        return div;
                    }
                    function paddingDiff(col) {
                        if (getStyleVal(col, 'box-sizing') === 'border-box') {
                            return 0;
                        }
                        const padLeft = getStyleVal(col, 'padding-left');
                        const padRight = getStyleVal(col, 'padding-right');
                        return parseInt(padLeft) + parseInt(padRight);
                    }
                    function getStyleVal(elm, css) {
                        return window.getComputedStyle(elm, null).getPropertyValue(css);
                    }
                    function removeBorder(e) {
                        e.target.style.borderInlineEnd = '';
                        if (e.target.previousElementSibling) {
                            e.target.previousElementSibling.style.visibility = 'visible';
                        }
                    }
                }
                DataGrid.EnableColumnResizing = EnableColumnResizing;
                function ResetColumnWidths(gridElement) {
                    const isGrid = gridElement.classList.contains('grid');
                    const grid = grids.find(grid => grid.id === gridElement.id);
                    if (!grid) {
                        return;
                    }
                    if (isGrid) {
                        gridElement.style.gridTemplateColumns = grid.initialWidths;
                        const resolvedWidths = window.getComputedStyle(gridElement).gridTemplateColumns.split(' ');
                        grid.columns.forEach((column, index) => {
                            column.size = resolvedWidths[index];
                            column.header.style.width = "";
                        });
                    }
                    else {
                        const columnsWidths = grid.initialWidths.split(' ');
                        grid.columns.forEach((column, index) => {
                            column.size = columnsWidths[index];
                            column.header.style.width = column.size;
                        });
                    }
                    gridElement.dispatchEvent(new CustomEvent('closecolumnresize', { bubbles: true }));
                    gridElement.focus();
                }
                DataGrid.ResetColumnWidths = ResetColumnWidths;
                function ResizeColumnDiscrete(gridElement, column, change) {
                    const isGrid = gridElement.classList.contains('grid');
                    const columns = [];
                    let headerBeingResized;
                    if (!column) {
                        const targetElement = document.activeElement?.parentElement?.parentElement?.parentElement?.parentElement;
                        if (!(targetElement && targetElement.classList.contains('column-header') && targetElement.classList.contains('resizable'))) {
                            return;
                        }
                        headerBeingResized = targetElement;
                    }
                    else {
                        headerBeingResized = gridElement.querySelector('.column-header[col-index="' + column + '"]');
                    }
                    grids.find(grid => grid.id === gridElement.id).columns.forEach((column) => {
                        if (column.header === headerBeingResized) {
                            const width = headerBeingResized.offsetWidth + change;
                            if (change < 0) {
                                column.size = Math.max(parseInt(column.header.style.minWidth === '' ? '100' : column.header.style.minWidth, 10), width) + 'px';
                            }
                            else {
                                column.size = width + 'px';
                            }
                            column.header.style.width = column.size;
                        }
                        if (isGrid) {
                            if (column.size.startsWith('minmax')) {
                                column.size = column.header.offsetWidth + 'px';
                            }
                            columns.push(column.size);
                        }
                    });
                    if (isGrid) {
                        gridElement.style.gridTemplateColumns = columns.join(' ');
                    }
                }
                DataGrid.ResizeColumnDiscrete = ResizeColumnDiscrete;
                function ResizeColumnExact(gridElement, column, width) {
                    const isGrid = gridElement.classList.contains('grid');
                    const columns = [];
                    let headerBeingResized = gridElement.querySelector('.column-header[col-index="' + column + '"]');
                    if (!headerBeingResized) {
                        return;
                    }
                    grids.find(grid => grid.id === gridElement.id).columns.forEach((column) => {
                        if (column.header === headerBeingResized) {
                            column.size = Math.max(parseInt(column.header.style.minWidth === '' ? '100' : column.header.style.minWidth, 10), width) + 'px';
                            column.header.style.width = column.size;
                        }
                        if (isGrid) {
                            if (column.size.startsWith('minmax')) {
                                column.size = column.header.offsetWidth + 'px';
                            }
                            columns.push(column.size);
                        }
                    });
                    if (isGrid) {
                        gridElement.style.gridTemplateColumns = columns.join(' ');
                    }
                    gridElement.dispatchEvent(new CustomEvent('closecolumnresize', { bubbles: true }));
                    gridElement.focus();
                }
                DataGrid.ResizeColumnExact = ResizeColumnExact;
                function AutoFitGridColumns(gridElement, columnCount) {
                    let gridTemplateColumns = '';
                    for (let i = 0; i < columnCount; i++) {
                        const columnWidths = Array
                            .from(gridElement.querySelectorAll(`[col-index="${i + 1}"]`))
                            .flatMap((x) => x.offsetWidth);
                        const maxColumnWidth = Math.max(...columnWidths);
                        gridTemplateColumns += ` ${maxColumnWidth}px`;
                    }
                    gridElement.style.gridTemplateColumns = gridTemplateColumns;
                    gridElement.classList.remove('auto-fit');
                    const grid = grids.find(grid => grid.id === gridElement.id);
                    if (grid) {
                        grid.initialWidths = gridTemplateColumns;
                    }
                }
                DataGrid.AutoFitGridColumns = AutoFitGridColumns;
                function DynamicItemsPerPage(gridElement, dotNetObject, rowSize) {
                    const observer = new ResizeObserver(() => {
                        const visibleRows = calculateVisibleRows(gridElement, rowSize);
                        dotNetObject.invokeMethodAsync('UpdateItemsPerPageAsync', visibleRows)
                            .catch((err) => console.error('Error invoking Blazor method:', err));
                    });
                    const targetElement = gridElement.parentElement;
                    if (targetElement) {
                        observer.observe(targetElement);
                    }
                }
                DataGrid.DynamicItemsPerPage = DynamicItemsPerPage;
                function calculateVisibleRows(gridElement, rowHeight) {
                    if (rowHeight <= 0) {
                        return 0;
                    }
                    const gridContainer = gridElement.parentElement;
                    if (!gridContainer) {
                        return 0;
                    }
                    const availableHeight = gridContainer?.clientHeight || window.visualViewport?.height || window.innerHeight;
                    const visibleRows = Math.max(Math.floor(availableHeight / rowHeight), 1);
                    return visibleRows;
                }
            })(DataGrid = Blazor.DataGrid || (Blazor.DataGrid = {}));
        })(Blazor = FluentUI.Blazor || (FluentUI.Blazor = {}));
    })(FluentUI = Microsoft.FluentUI || (Microsoft.FluentUI = {}));
})(Microsoft || (Microsoft = {}));
