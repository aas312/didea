const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT'

const updateAccount = account => ({
  type: UPDATE_ACCOUNT,
  account,
})

export { UPDATE_ACCOUNT, updateAccount }
export default { UPDATE_ACCOUNT }
