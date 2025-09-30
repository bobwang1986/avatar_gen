document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const avatarUpload = document.getElementById('avatar-upload');
    const originalImage = document.getElementById('original-image');
    const resultCanvas = document.getElementById('result-canvas');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const previewSection = document.querySelector('.preview-section');
    
    // 加载国旗装饰图片
    const flagImage = new Image();
    
    // 设置图片加载事件
    flagImage.onload = function() {
        console.log('国旗装饰图片加载成功');
    };
    
    flagImage.onerror = function(e) {
        console.error('国旗装饰图片加载失败', e);
        alert('国旗装饰图片加载失败，请确保assets/flag.png文件存在');
    };
    
    // 设置跨域属性
    flagImage.crossOrigin = 'anonymous';
    
    // 通过HTTP服务器加载图片
    flagImage.src = 'assets/flag.png';
    
    // 用户上传头像
    avatarUpload.addEventListener('change', function(e) {
        if (e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        
        // 检查文件类型
        if (!file.type.match('image.*')) {
            alert('请上传图片文件！');
            return;
        }
        
        // 读取并显示原始头像
        const reader = new FileReader();
        reader.onload = function(event) {
            originalImage.src = event.target.result;
            originalImage.onload = function() {
                // 显示预览区域
                previewSection.classList.add('show');
                // 启用生成按钮
                generateBtn.disabled = false;
                // 初始化画布大小，与CSS中的.image-container尺寸匹配
                resultCanvas.width = 250;
                resultCanvas.height = 250;
            };
        };
        reader.readAsDataURL(file);
    });
    
    // 生成国庆主题头像
    generateBtn.addEventListener('click', function() {
        const ctx = resultCanvas.getContext('2d');
        
        // 清空画布
        ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
        
        // 计算缩放和居中参数
        const scale = Math.min(
            resultCanvas.width / originalImage.naturalWidth,
            resultCanvas.height / originalImage.naturalHeight
        );
        
        const x = (resultCanvas.width - originalImage.naturalWidth * scale) / 2;
        const y = (resultCanvas.height - originalImage.naturalHeight * scale) / 2;
        const width = originalImage.naturalWidth * scale;
        const height = originalImage.naturalHeight * scale;
        
        // 绘制原始头像（居中并缩放）
        ctx.drawImage(originalImage, x, y, width, height);
        
        // 在头像上方叠加五星红旗图片（透明PNG）
        ctx.drawImage(flagImage, 0, 0, resultCanvas.width, resultCanvas.height);
        
        // 启用下载按钮
        downloadBtn.disabled = false;
    });
    
    // 下载生成的头像（修复版）
    downloadBtn.addEventListener('click', function() {
        try {
            // 创建一个新的Canvas元素，使用与resultCanvas相同的尺寸
            const downloadCanvas = document.createElement('canvas');
            downloadCanvas.width = resultCanvas.width;
            downloadCanvas.height = resultCanvas.height;
            const dCtx = downloadCanvas.getContext('2d');
            
            // 重新绘制内容到新Canvas，而不是直接复制
            // 1. 首先绘制原始头像
            const scale = Math.min(
                resultCanvas.width / originalImage.naturalWidth,
                resultCanvas.height / originalImage.naturalHeight
            );
            
            const x = (resultCanvas.width - originalImage.naturalWidth * scale) / 2;
            const y = (resultCanvas.height - originalImage.naturalHeight * scale) / 2;
            const width = originalImage.naturalWidth * scale;
            const height = originalImage.naturalHeight * scale;
            
            // 绘制原始头像（居中并缩放）
            dCtx.drawImage(originalImage, x, y, width, height);
            
            // 2. 然后绘制国旗装饰
            dCtx.drawImage(flagImage, 0, 0, downloadCanvas.width, downloadCanvas.height);
            
            // 导出为图片并下载
            const dataURL = downloadCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = '国庆主题头像.png';
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('下载过程中出错:', error);
            alert('下载头像时出错: ' + error.message);
        }
    });
});