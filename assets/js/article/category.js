$(function () {
    const { form } = layui
    let index
    // 1.从服务器获取文章列表数据，并渲染到页面

    function getCateList() {
        // 1.1发送请求
        axios.get('/my/article/cates').then(res => {
            // console.log(res);
            // 1.2判断请求失败
            if (res.status !== 0) {
                return layer.msg('获取分类列表失败')
            }
            // 1.4请求成功TODO
            // 使用模板引擎渲染页面:1.引入插件2.准备一个模板3.调用一个模板函数
            const htmlStr = template('tpl', res)
            // console.log(htmlStr);
            // 1.5把html字符串渲染到tbody表格主体中
            $('tbody').html(htmlStr)
        })
    }
    getCateList()
    // 2.点击添加按钮，添加一个文章分类
    $('.add-btn').click(function () {

        // 2.1点完之后，显示一个弹出层
        index = layer.open({
            type: 1,
            // 弹出的标题
            title: '添加文章分类',
            // 弹出层的内容
            content: $('.add-form-container').html(),
            // 弹出层的宽高
            area: ['500px', '250px']
        })
    })
    // 3.监听添加表单的提交事件
    // 坑：注意这个表单点击之后再去添加的，后创建的元素绑定事件统一使用“事件委托”
    $(document).on('submit', '.add-form', function (e) {
        e.preventDefault()
        // 3.1发送请求，把表单数据提交的服务器
        axios.post('/my/article/addcates', $(this).serialize()).then(res => {

            // console.log(res);
            // 3.2判断失败
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            // 3.3成功TODO，关闭弹出层，index 为定义弹出层位置的返回值
            layer.close(index)
            // 3.4更新外层分类表格数据，重新调用方法渲染即可
            getCateList()
        })
    })
    // 4 点击编辑按钮，弹出编辑表单
    $(document).on('click', '.edit-btn', function () {
        // console.log(123);
        // 4.1点完之后，显示一个弹出层
        index = layer.open({
            type: 1,
            // 弹出的标题
            title: '修改文章分类',
            // 弹出层的内容
            content: $('.edit-form-container').html(),
            // 弹出层的宽高
            area: ['500px', '250px']
        })
        // 4.2获取自定义属性的值
        // console.log($(this).data('id'));
        const id = $(this).data('id')
        // 4.3发送请求到服务器，获取当前的分类数据
        axios.get(`/my/article/cates/${id}`).then(res => {
            // console.log(res);

            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            // 4.4对编辑表单进行赋值
            form.val('edit-form', res.data)
        })

    })
    // 5.监听编辑表单的提交事件
    $(document).on('submit', '.edit-form', function (e) {
        e.preventDefault()
        // 5.1发送请求到服务器,提交表单数据
        axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
            // console.log(res);
            // 5.3判断失败
            if (res.status !== 0) {
                return layer.msg('更新失败!')
            }
            // 5.4成功TODO，关闭弹出层，index为定义弹出层位置的返回值
            layer.close(index)
            // 5.5 更新外层分类表格数据，重新调用即可
            getCateList()
        })
    })
    // 6.点击删除当前表单
    $(document).on('click', '.del-btn', function () {
        // 获取自定义属性的值
        const id = $(this).data('id')
        // 6.1查文档，显示询问类型的弹出层
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {

            // 6.2发送请求到服务器删除这条类
            axios.get(`/my/article/deletecate/${id}`).then(res => {

                if (res.status !== 0) {
                    return layer.msg('删除失败!')
                }
                layer.msg('删除成功')
                getCateList()
            })
            // 关闭弹出层
            layer.close(index)
        })

    })

})