import urllib.request
import re

try:
    req = urllib.request.Request('https://doramclub.ru/list.html', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    matches = re.findall(r'<img[^>]+src="(https://doramclub\.ru/wp-content/uploads/[^"]+)"', html)
    for m in list(set(matches))[:20]:
        print(m)
except Exception as e:
    print(e)
