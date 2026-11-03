"""
在网站已经部署、拿到公开HTTPS网址后运行：
  pip install qrcode[pil]
  python 生成景点二维码.py https://你的真实网址.pages.dev/
会创建“二维码”目录：一个首页总码、八个景点独立二维码。
注意：本地 file:// 地址无法供他人扫码访问，请使用发布后的真实网址。
"""
import sys
from pathlib import Path
from urllib.parse import urlencode, urlsplit, urlunsplit
try:
    import qrcode
except ImportError:
    raise SystemExit('请先安装依赖：pip install qrcode[pil]')
if len(sys.argv)!=2 or not sys.argv[1].startswith(('https://','http://')):
    raise SystemExit('用法：python 生成景点二维码.py https://实际部署后的域名/')
base=sys.argv[1].rstrip('/')+'/'
u=urlsplit(base)
if not u.netloc:
    raise SystemExit('请输入真实网址')
base=urlunsplit((u.scheme,u.netloc,u.path,'',''))
spots=[('tomato','01_高山番茄谷'),('research','02_高山蔬菜研究所'),('art','03_国际创客艺术村'),('tree','04_九耙树'),('red','05_红军游击队旧址'),('stone','06_仙女石'),('camp','07_浪坝1851营地'),('pasture-trail','08_仙南牧道')]
out=Path(__file__).resolve().parent/'二维码';out.mkdir(exist_ok=True)
def save(url,name):
    im=qrcode.make(url,box_size=16,border=4,error_correction=qrcode.constants.ERROR_CORRECT_H)
    im.save(out/f'{name}.png')
save(base,'00_双河镇导览首页')
for ident,name in spots:save(base+'?'+urlencode({'spot':ident}),name)
print('成功生成9张二维码图片：',out)
print('注意：二维码正式印刷前，请使用微信在不同网络环境下扫码验证。')
