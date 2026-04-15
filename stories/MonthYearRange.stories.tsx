import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Description, Controls, Stories, Title as TitleDoc } from "@storybook/addon-docs/blocks";
import { MonthYearRange, TMonthYearRangeValue } from "../src/components/MonthYearRange";
import { EDateRangeShiftUnit } from "../src/components/DateRange";
import { EComponentSize } from "../src/enums";
import { EFormFieldStatus } from "../src/components/FormField";

export default {
    title: "Components/MonthYearRange",
    component: MonthYearRange,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                component: `
Компонент MonthYearRange объединяет два поля MonthYearField в один контрол выбора диапазона месяцев.

## Основные возможности

- **Диапазон месяцев** - выбор начального и конечного месяца
- **Навигация** - сдвиг диапазона назад и вперёд
- **Контролируемое значение** - внешний контроль диапазона через value/onChange
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
} satisfies Meta<typeof MonthYearRange>;

type Story = StoryObj<typeof MonthYearRange>;

export const Playground: Story = {
    args: {
        shiftAmount: 1,
        shiftUnit: EDateRangeShiftUnit.MONTH,
        hideNavigation: false,
        pickerFromProps: {
            label: "С",
            placeholder: "Месяц",
            size: EComponentSize.MD,
            status: EFormFieldStatus.DEFAULT,
        },
        pickerToProps: {
            label: "По",
            placeholder: "Месяц",
            size: EComponentSize.MD,
            status: EFormFieldStatus.DEFAULT,
        },
    },
    argTypes: {
        shiftAmount: {
            control: { type: "number", min: 1, max: 12 },
        },
        shiftUnit: {
            control: { type: "select" },
            options: Object.values(EDateRangeShiftUnit),
        },
        hideNavigation: {
            control: { type: "boolean" },
        },
    },
    parameters: {
        controls: {
            include: ["shiftAmount", "shiftUnit", "hideNavigation"],
        },
    },
    render: (args) => {
        const [value, setValue] = useState<TMonthYearRangeValue>(["20240101", "20240301"]);

        return (
            <div style={{ maxWidth: "560px" }}>
                <MonthYearRange {...args} value={value} onChange={setValue} />
            </div>
        );
    },
};

export const Default: Story = {
    parameters: {
        controls: { disable: true },
    },
    render: () => {
        const [value, setValue] = useState<TMonthYearRangeValue>(["20240101", "20240301"]);

        return (
            <div style={{ maxWidth: "560px" }}>
                <MonthYearRange
                    value={value}
                    onChange={setValue}
                    pickerFromProps={{ label: "С", placeholder: "Месяц" }}
                    pickerToProps={{ label: "По", placeholder: "Месяц" }}
                />
            </div>
        );
    },
};
