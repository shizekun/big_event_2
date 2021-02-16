$(function () {
    const { form, laypage } = layui
    // 从服务器获取文章的分类列表数据
    getCateList()
    function getCateList() {
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            // 1.3判断请求失败
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            // 1.4遍历数组，渲染下拉组件的选项
            res.data.forEach(item => {
                // 每遍历一次就向下拉选择框中添加一条 Option
                $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
                // 1.5坑：动态创建的表单元素需要手动更新表单
                form.render('select')
            })
        })
    }
    const query = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    // 3.发送请求到服务器，获取文章列表数据
    renderTable()
    function renderTable() {
        axios.get('/my/article/list', { params: query }).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            // 调用模板函数之前去注册过滤器
            template.defaults.imports.dateFormat = function (date) {
                return moment(date).format('YYYY/MM/DD HH:mm:ss')
            }
            // 3.2使用模板引擎来渲染
            const htmlStr = template('tpl', res)
            console.log(htmlStr);
            // 3.3添加到tbody中
            $('tbody').html(htmlStr)
            // 3.4渲染分页器
            renderPage(res.total)
        })
    }
    // 4.把服务端获取的数据，渲染成分页器
    function renderPage(total) {
        // 4.1调用layui 文档中的render方法
        laypage.render({
            elem: 'pagination',//注意，是ID,不用加#
            count: total,//数据总数，从服务器端得到
            limit: query.pagesize,//每页显示的数量
            limits: [2, 3, 4, 5],//每页的数据条数
            curr: query.pagenum,//当前的页码数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],//分页器的布局排版
            // 切换分页回调函数
            jump: function (obj, first) {
                // obj包含了当前分页的所有参数，比如：
                console.log(obj.curr);//得到当前页，以便向服务端请求对应页的数据
                console.log(obj.limit);//得到每页显示的条数
                // 4.2修改查询对象的参数
                query.pagenum = obj.curr
                query.pagesize = obj.limit
                // 首次不执行
                if (!first) {
                    // 4.3非首次进入页面，需要重新渲染表格数据
                    renderTable()
                }
            }
        })
    }
    // 5.表单筛选功能
    $('.layui-form').submit(function (e) {
        e.preventDefault()
        // 5.1 获取下拉选择框的分类id和状态this.serialize()
        const cate_id = $('#cate-sel').val()
        const state = $('#state').val()
        console.log(cate_id, state);
        // 5.2把获取到的值重新赋值给query对象
        query.cate_id = cate_id
        query.state = state
        // 优化： 发送请求之前去修改页码值为第一页1
        query.pagenum = 1
        //5.2 重新调用一下渲染表格的方法
        renderTable()
    })
    // 6.点击删除按钮，删除当前文章
    $(document).on('click', '.del-btn', function () {
        // 获取自定义属性的值
        const id = $(this).data('id')
        // 6.1查文档，显示询问类型的弹出层
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {

            // 6.2发送请求到服务器删除这条类
            axios.get(`/my/article/delete/${id}`).then(res => {

                if (res.status !== 0) {
                    return layer.msg('删除失败!')
                }
                layer.msg('删除成功')
                // 填坑处理：当前页只有一条数据且不处在第一页的时候，点击删除这条数据之后，手动更新上一页的数据
                if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                    query.pagenum--
                }
                renderTable()
            })
            // 关闭弹出层
            layer.close(index)
        })
    })
    // 7.点击编辑按钮，跳转到文章编辑页面
    $(document).on('click', '.edit-btn', function () {
        // 获取当前文章id
        const id = $(this).data('id')
        // 如何在两个页面之间进行数据传递：使用查询参数 ?name=tom&age=10
        location.href = `./edit.html?id=${id}`
        // 左侧导航更新
        window.parent.$('.layui-this').next().find('a').click()

    })












})