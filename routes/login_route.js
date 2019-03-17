var submit=document.getElementById('login_id');

submit.onclick=function()
{
    var nameInput=document.getElementById('name');
	var passInput=document.getElementById('pass');

    var name=nameInput.value;
	var pass=passInput.value;
    //create the reqest object
    var request=new XMLHttpRequest();
    //capture the request and stare it in the variable
    request.onreadystatechange=function()
    {
        if(request.readyState===XMLHttpRequest.DONE)
        {
            //take some action
            if(request.status===200)
            {
 /*               var names=request.responseText;
                names=JSON.parse(names);
                var list='';
                for(var i=0;i<names.length;i++)
                {
                list+='<li>'+names[i]+'</li>';
                }
                var ul=document.getElementById('namelist');
                ul.innerHTML=list;  */
            }else{
			print("NOT OK");
			}
        }
    };

    //make the request
    request.open('POST', '/login?name='+name+'pass='+pass, true);
    request.send(null);
};