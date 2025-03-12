/**
 * @todo Loại bỏ các trường là falsy trong obj
 * @param {Object} params - obj được truyền vào
 * @param {Array} arrayValueAccepted - mảng giá trị được chấp nhận và không muốn bỏ qua
 * @returns {Object} - object đã loại bỏ các trường là falsy trong obj
 */
const onRemoveParams = (params, arrayValueAccepted = []) => {
  // Chọn các giá trị được chấp nhận trong mảng truyền vào
  const onCheckAcceptedValue = (value) => {
    if (arrayValueAccepted.length === 0) return false;
    return arrayValueAccepted.includes(value);
  };

  const handleRemoveNullUndefined = (obj) => {
    if (!obj) return {};
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => Boolean(value) || onCheckAcceptedValue(value)
      )
    );
  };

  return handleRemoveNullUndefined(params);
};

export default onRemoveParams;
