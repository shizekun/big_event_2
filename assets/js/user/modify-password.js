$(function () {

    const { form, layer } = layui

    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        confirmPass: function (val) {
            if (val !== $('#pass').val()) {
                return '两次输入的密码不一致！'
            }
        }
    })

    $('.layui-form').submit(function (e) {
        e.preventDefault()

        axios.post('/my/updatepwd', $(this).serialize())
            .then(res => {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg('修改密码失败！')
                }
                layer.msg('修改密码成功！')
                // 跳转到登录页
                window.parent.location.href = '../login.html'
                // 原先 taken令牌清除
                localStorage.removeItem('token')
            })
    })
})