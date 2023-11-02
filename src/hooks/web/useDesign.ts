export function useDesign(scope: string) {
    const values = { prefixCls: 'iam' };

    return {
        prefixCls: `${values.prefixCls}-${scope}`,
        prefixVar: values.prefixCls
    };
}
