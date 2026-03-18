# Triplex-next

### Версионирование

- Разработка версии для React 18 ведется в ветке main. Релизы с версии 1.0.0 до 2.0.0(не включительно).
- Разработка версии для React 17 ведется в ветке release-0. Релизы с версии 0.10.0 до 1.0.0(не включительно).


## 🚀 Установка

```bash
npm install @sberbusiness/triplex-next @sberbusiness/icons-next
```

## Импортировать стили
```ts
import '@sberbusiness/triplex-next/styles/triplex-next.css';
import '@sberbusiness/icons-next/styles/icons.css';
```

## 🔤 Шрифты

Компоненты Typography используют шрифты SBSansDisplay и SBSansText. Для корректного отображения необходимо подключить шрифты в вашем проекте:

```css
@font-face {
    font-family: 'SBSansDisplay';
    src: url('node_modules/@sberbusiness/triplex-next/assets/fonts/SBSansDisplay-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'SBSansDisplayMedium';
    src: url('node_modules/@sberbusiness/triplex-next/assets/fonts/SBSansDisplay-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
}

@font-face {
    font-family: 'SBSansDisplaySemibold';
    src: url('node_modules/@sberbusiness/triplex-next/assets/fonts/SBSansDisplay-SemiBold.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
}

@font-face {
    font-family: 'SBSansDisplayBold';
    src: url('node_modules/@sberbusiness/triplex-next/assets/fonts/SBSansDisplay-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
}

@font-face {
    font-family: 'SBSansText';
    src: url('node_modules/@sberbusiness/triplex-next/assets/fonts/SBSansText-Regular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'SBSansTextSemibold';
    src: url('node_modules/@sberbusiness/triplex-next/assets/fonts/SBSansText-Semibold.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
}
```


---

## 📁 Структура

```
src/
  components/
    ComponentName/
      index.ts
      ComponentName.tsx
      styles/ComponentName.module.less
      __tests__/ComponentName.test.tsx
```

> Каждый компонент должен иметь собственный `index.ts`, чтобы поддерживать генерацию `exports` в `package.json`.

---

## 📜 Скрипты

| Скрипт | Назначение |
|-------|------------|
| `npm run build` | Сборка компонентов и `style.css` в `dist/` |
| `npm run storybook` | Локальный просмотр компонентов |
| `npm run storybook:build` | Сборка Storybook в `storybook-static/` |

---

## 🧱 Добавление нового компонента

1. Создать каталог:

```bash
src/components/Alert/
```

2. Добавить файлы:

```
Alert.tsx
styles/Alert.module.less
index.ts         ← обязательный!
```

3. Указать экспорт в `src/index.ts`:

```ts
export * from './components/Alert';
```

---
## 🧪 Тестирование

Проект использует [Vitest](https://vitest.dev/) для unit-тестирования и [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) для тестирования компонентов.

Для pull request обязательным GitHub check является сборка библиотеки (`Build library`).

### Как запустить тесты локально

```bash
npm run test-e2e         # Запуск e2e тестов
npm run test-unit         # Запуск unit тестов
npm run test-unit:watch   # Запуск unit тестов в режиме наблюдения
npm run test-unit:coverage # Запуск unit тестов и генерация отчёта о покрытии
```

## Symphony

Репозиторий подключен к `OpenAI Symphony` для автоматической обработки задач из Linear: агент может взять задачу, подготовить ветку, открыть PR и довести его до merge при зеленом CI.
Черновая интеграция `OpenAI Symphony` для работы с Linear и bot-driven PR описана в [docs/symphony.md](docs/symphony.md). Основной workflow для сервиса лежит в `WORKFLOW.md`.
Для варианта с VPS есть отдельная инструкция в [docs/symphony-vps.md](docs/symphony-vps.md).
