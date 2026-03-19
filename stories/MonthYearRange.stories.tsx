import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Title as TitleDoc, Description, Controls, Stories } from "@storybook/addon-docs/blocks";
import { MonthYearRange, TMonthYearRangeValue } from "../src/components/MonthYearRange";
import { EDateRangeShiftUnit } from "../src/components/DateRange";

export default {
    title: "Components/MonthYearRange",
    component: MonthYearRange,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
Компонент MonthYearRange представляет собой выбор диапазона месяцев/лет на базе двух MonthYearField.

## Основные возможности

- **Диапазон периода** - независимый выбор начала и конца периода
- **Навигация** - сдвиг диапазона назад и вперёд
- **Управляемое состояние** - controlled value и единый callback изменения
- **Гибкая настройка** - отдельные props для полей "с" и "по"
                `,
            },
            page: () => (
                <>
                    <TitleDoc />
                    <Description />
                    <Controls of={Default} />
                    <Stories />
                </>
            ),
        },
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: "560px" }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        shiftAmount: {
            control: { type: "number", min: 1, max: 12 },
            description: "Численная величина сдвига диапазона месяцев/лет.",
            table: {
                type: { summary: "number" },
                defaultValue: { summary: "1" },
            },
        },
        shiftUnit: {
            control: { type: "select" },
            options: Object.values(EDateRangeShiftUnit),
            description: "Единица измерения сдвига диапазона.",
            table: {
                type: { summary: "EDateRangeShiftUnit" },
                defaultValue: { summary: "EDateRangeShiftUnit.MONTH" },
            },
        },
        hideNavigation: {
            control: { type: "boolean" },
            description: "Скрыть кнопки навигации.",
            table: {
                type: { summary: "boolean" },
                defaultValue: { summary: "false" },
            },
        },
    },
} satisfies Meta<typeof MonthYearRange>;

type Story = StoryObj<typeof MonthYearRange>;

export const Default: Story = {
    parameters: {
        controls: { disable: true },
    },
    render: () => {
        const [value, setValue] = useState<TMonthYearRangeValue>(["20240101", "20240301"]);

        return (
            <MonthYearRange
                value={value}
                onChange={setValue}
                pickerFromProps={{ label: "Период с", placeholder: "Выберите месяц" }}
                pickerToProps={{ label: "Период по", placeholder: "Выберите месяц" }}
                buttonBackProps={{ "aria-label": "Сдвинуть назад" }}
                buttonForwardProps={{ "aria-label": "Сдвинуть вперёд" }}
            />
        );
    },
};

export const Playground: Story = {
    args: {
        shiftAmount: 1,
        shiftUnit: EDateRangeShiftUnit.MONTH,
        hideNavigation: false,
    },
    parameters: {
        controls: {
            include: ["shiftAmount", "shiftUnit", "hideNavigation"],
        },
    },
    render: (args) => {
        const [value, setValue] = useState<TMonthYearRangeValue>(["", ""]);

        return (
            <MonthYearRange
                {...args}
                value={value}
                onChange={setValue}
                pickerFromProps={{ label: "Период с", placeholder: "Выберите месяц" }}
                pickerToProps={{ label: "Период по", placeholder: "Выберите месяц" }}
                buttonBackProps={{ "aria-label": "Сдвинуть назад" }}
                buttonForwardProps={{ "aria-label": "Сдвинуть вперёд" }}
            />
        );
    },
};
