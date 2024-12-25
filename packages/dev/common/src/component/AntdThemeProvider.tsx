import {ConfigProvider, theme} from "antd";
import {HappyProvider} from '@ant-design/happy-work-theme';
import React from "react";

let themeConfig = {
    // 1. 单独使用暗色算法
    // algorithm: theme.darkAlgorithm,

    // 2. 组合使用暗色算法与紧凑算法
    algorithm: [theme.compactAlgorithm],
    "components": {
        "Form": {
            "itemMarginBottom": 5
        },
        "Tabs": {
            "paddingLG": 10,
            // "paddingSM": 5,
            // "cardPadding": "6px 8px"
        }
    }
}
const AntdThemeProvider: React.FC<React.PropsWithChildren> = (props) => {
    const {children} = props;
    return (
        <ConfigProvider
            theme={themeConfig}
            wave={{
                disabled: true
            }}
        >
            <HappyProvider disabled={true}>
                {children}
            </HappyProvider>
        </ConfigProvider>
    )
}


export {
    AntdThemeProvider
}
