#FastAPI 세팅

from fastapi import FastAPI
#fastAPI에서 import 할거다 fastapi라는 패키지에서 가져와서
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
#Staticfiles 정적파일들을 서버에 주입시키겠다(html,css)

app = FastAPI()


answer = 'SUNNY'

@app.get('/answer')
def get_answer():
    return answer


app.mount("/", StaticFiles(directory="static", html=True), name="static")
# 루트경로로 지정. static이라는 폴더로 향하도록 , html 옵션을 true로 설정 (그럼 깔끔해짐)
# 디렉토리를 static으로 만들기`


class Item(BaseModel):
    id:int
    content:str


items = ['맥북','애플워치','아이폰','에어팟']

# @app.get("/items")`
# def readitems():
#     return items


# @app.get('/items/{id}')
# def read_id_item(id):
#     return items[int(id)]

## uvicorn main:app --reload
## uvicorn 이라는 웹서버를 이용해서 패스트 api를 띄움
## main.py라는 안에 있는 app이라는 객체를 파일을 실행시킨다
## 상단에 app = FastAPI()로 지정해줘서
## reload 다시 띄운다는 얘기임


#쿼리방식
@app.get('/items')
def read_item(skip:int=0, limit:int=0):
    return items[skip:skip+limit]


#포스트방식
@app.post("items")
def post_item(item:Item):
    items.append(item.content)
    return '성공했습니다!'