$(function () {
    // 在全局定义 state状态：
    let state = ''
    // 提取插件
    const { form } = layui
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

    // 2.初始化富文本编辑器
    initEditor()
    // 3。先获取要裁剪的图片
    const $image = $('#image')
    // 4.初始化裁剪区
    $image.cropper({
        // 指定宽高比
        aspectRatio: 400 / 280,
        // 指定预览区域
        preview: '.img-preview'
    })
    // 5.为选择封面按钮绑定点击事件
    $('#choose-btn').click(function () {
        // 自动触发文件框的点击事件
        $('#file').click()
    })
    // 6.给文件选择框绑定change事件
    $('#file').change(function () {
        // 6.1获取所有的文件列表
        console.log(this.files[0]);
        // 6.2把文件转成blob格式的url
        const imgUrl = URL.createObjectURL(this.files[0])
        // 6.3替换掉裁剪区的图片
        $image.cropper('replace', imgUrl)
    })
    // 7.监听表单的提交事件(点击发布或存为草稿)
    $('.publish-form').submit(function (e) {
        e.preventDefault()
        // 7.1获取表单中所有的内容=》new FormData(原生表单元素)
        const fd = new FormData(this)
        // formdata 相关方法：append() set() get() forEach()
        // 7.2检测 formdata 中的数据项是否获取成功
        fd.forEach(item => {
            console.log(item);
        })
        // 7.3向fd中新增state文章状态数据
        fd.append('state', state)
        // 7.4获取裁剪封面图片的二进制数据
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(blob => {
            console.log(blob);//二进制图片数据
            // 7.5把获取的图片数据添加到formdata中
            fd.append('cover_img', blob)
            // 7.6 TODO调用函数，提交数据到服务器
            publishArticle(fd)
        })
    })
    // 8.点击发布和存为草稿按钮，改变state状态值
    $('.last-row button').click(function () {
        //8.1 获取自定义属性
        console.log($(this).data('state'));
        state = $(this).data('state')
    })
    // 9.在外层封装一个发布文章到服务器的函数，参数就是组装好的formdata数据
    function publishArticle(fd) {
        // 发送请求
        axios.post('/my/article/add', fd).then(res => {
            console.log(res);
            // 9.1请求失败
            if (res.status !== 0) {
                return layer.msg('发布文章失败!')
            }
            layer.msg(state == '草稿' ? '发布草稿成功!' : '发布文章成功!')

            // TODO: 跳转到文章列表页
            location.href = './list.html'

            // 左侧导航更新
            window.parent.$('.layui-this').prev().find('a').click()

        })
    }
})