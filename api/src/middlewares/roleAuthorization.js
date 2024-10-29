export const roleAuthorization = (role) => {
  return async(req, res, next)=>{
    if(!req.user) return res.status(401).json({error: 'unauthorized'})
    if(req.user.role !== role){
      return res.status(403).json({error: 'You dont have permissions'})
    }
    next()
  }
}