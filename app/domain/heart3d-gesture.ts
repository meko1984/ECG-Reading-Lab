import type { Camera } from './heart3d';

type Point = { x:number; y:number };
export function clampZoom(zoom:number) { return Math.max(.7,Math.min(1.65,zoom)); }
/** Pointer input is shared by mouse, pen and touch; pinch never counts as a tap. */
export function createHeartGesture() {
  const pointers=new Map<number,Point>();
  let moved=false,pinched=false,origin:Point={x:0,y:0};
  return {
    down(id:number,point:Point) {
      pointers.set(id,point);
      if(pointers.size===1){moved=false;pinched=false;origin=point;}
      if(pointers.size>1)pinched=true;
    },
    move(id:number,next:Point): ((camera:Camera)=>Camera)|null {
      const previous=pointers.get(id);if(!previous)return null;
      if(Math.hypot(next.x-origin.x,next.y-origin.y)>7)moved=true;
      let update:((camera:Camera)=>Camera)|null=null;
      if(pointers.size===2){
        const other=[...pointers.entries()].find(([pointerId])=>pointerId!==id)![1];
        const before=Math.hypot(previous.x-other.x,previous.y-other.y),after=Math.hypot(next.x-other.x,next.y-other.y);
        if(before>5)update=c=>({...c,zoom:clampZoom(c.zoom*after/before)});
      }else if(pointers.size===1&&moved){
        const dx=next.x-previous.x,dy=next.y-previous.y;
        update=c=>({...c,yaw:c.yaw+dx*.009,pitch:c.pitch+dy*.009});
      }
      pointers.set(id,next);return update;
    },
    up(id:number) { const tap=pointers.has(id)&&!moved&&!pinched;pointers.delete(id);return tap; },
    cancel(id:number) { pointers.delete(id);moved=true; },
  };
}
