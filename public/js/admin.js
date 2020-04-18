
const deleteProduct=(btn)=>{

       const productId=btn.parentNode.querySelector('[name=productId]').value;
       const csrf =btn.parentNode.querySelector('[name=_csrf]').value;
        
       const elementTODelete=btn.closest("article");

       fetch('/admin/product/'+productId,{

            method:"delete",
            headers:{
                'csrf-token':csrf
            }

       }).then(result=>{
           elementTODelete.remove();
           console.log(result);

       })
       .catch(err=>{
            console.log(err);
            
       })

    }