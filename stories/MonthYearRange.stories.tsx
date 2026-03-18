import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Title as TitleDoc, Description, Controls, Primary, Stories } from "@storybook/addon-docs/blocks";
import { EDateRangeShiftUnit } from "../src/components/DateRange/enums";
import { MonthYearRange, TMonthYearRangeValue } from "../src/components/MonthYearRange";

export default {
    title: "Components/MonthYearRange",
    component: MonthYearRange,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
Компонент MonthYearRange представляет собой выбор диапазона месяцев и лет на основе двух MonthYearField.

## Основные возможности

- **Диапазон месяцев** - выбор периода с помощью полей "с" и "по"
- **Навигация** - сдвиг выбранного диапазона назад и вперёд
- **Контролируемое значение** - управление диапазоном через value и onChange
                `,
            },
            page: () => (
                <>
                    <TitleDoc />
                    <Description />
                    <Controls of={Default} />
                    <Primary />
                    <Stories />
                </>
            ),
        },
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: "420px" }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof MonthYearRange>;

type Story = StoryObj<typeof MonthYearRange>;

export const Playground: Story = {
    args: {
        shiftAmount: 1,
        shiftUnit: EDateRangeShiftUnit.MONTH,
        hideNavigation: false,
    },
    argTypes: {
        shiftAmount: {
            control: { type: "number", min: 1, max: 12 },
            description: "Численная величина сдвига диапазона месяцев.",
        },
        shiftUnit: {
            control: { type: "select" },
            options: Object.values(EDateRangeShiftUnit),
            description: "Единица измерения сдвига диапазона месяцев.",
        },
        hideNavigation: {
            control: { type: "boolean" },
            description: "Скрыть кнопки навигации.",
        },
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
                fieldPropsFrom={{ label: "С", placeholder: "Месяц и год" }}
                fieldPropsTo={{ label: "По", placeholder: "Месяц и год" }}
            />
        );
    },
};

export const Default: Story = {
    parameters: {
        controls: { disable: true },
    },
    render: () => {
        const [value, setValue] = useState<TMonthYearRangeValue>(["20240101", "20240601"]);

        return (
            <MonthYearRange
                value={value}
                onChange={setValue}
                fieldPropsFrom={{ label: "С", placeholder: "Месяц и год" }}
                fieldPropsTo={{ label: "По", placeholder: "Месяц и год" }}
            />
        );
    },
};
