interface TransformLabelOption {
  pidColumn: string;
  valueColumn: string;
  labelColumn: string;
  labelProp: string;
  valueProp: string;
  childrenProp: string;
}

export const defaultTransformLabelOption: TransformLabelOption = {
  pidColumn: 'pid',
  valueColumn: 'id',
  labelColumn: 'name',
  labelProp: 'title',
  valueProp: 'value',
  childrenProp: 'children',
};

export function transformLabel(items: any[], initPid: string | null, transformLabelOption: TransformLabelOption) {
  const result: any[] = [];
  for (const item of items) {
    if (item[transformLabelOption.pidColumn] === initPid) {
      const newItem = {
        [transformLabelOption.labelProp]: item[transformLabelOption.labelColumn],
        [transformLabelOption.valueProp]: item[transformLabelOption.valueColumn],
        [transformLabelOption.childrenProp]: transformLabel(items, item[transformLabelOption.valueColumn], transformLabelOption),
      };
      result.push(newItem);
    }
  }
  return result;
}
