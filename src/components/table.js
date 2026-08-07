import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });
    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => { // когда пользователь выбирает что-то в фильтрах
        onAction();
    });
    root.container.addEventListener('reset', () => { // когда пользователь нажимает кнопку «Сбросить фильтры»
        setTimeout(onAction);
    });
    root.container.addEventListener('submit', (e) => { // когда пользователь нажимает на кнопки страниц или сортировку
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}