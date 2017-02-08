// //大海
// #ifdef GL_ES
// precision mediump float;
// #endif

// uniform float time;
// vec2 mouse = vec2(20, 0);
// uniform vec2 resolution;

// // "Seascape" by Alexander Alekseev aka TDM - 2014
// // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// const int NUM_STEPS = 16;
// const float PI    = 3.1415;
// const float EPSILON = 1e-3;
// float EPSILON_NRM = 0.;

// // sea
// const int ITER_GEOMETRY = 3;
// const int ITER_FRAGMENT = 5;
// const float SEA_HEIGHT = 0.6;
// const float SEA_CHOPPY = 5.0;
// const float SEA_SPEED = 1.0;
// const float SEA_FREQ = 0.16;
// const vec3 SEA_BASE = vec3(0.1,0.19,0.22);
// const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6);
// float SEA_TIME = 0.;
// mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

// // math
// mat3 fromEuler(vec3 ang) {
//   vec2 a1 = vec2(sin(ang.x),cos(ang.x));
//     vec2 a2 = vec2(sin(ang.y),cos(ang.y));
//     vec2 a3 = vec2(sin(ang.z),cos(ang.z));
//     mat3 m;
//     m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
//   m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
//   m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
//   return m;
// }
// float hash( vec2 p ) {
//   float h = dot(p,vec2(127.1,311.7)); 
//     return fract(sin(h)*43758.5453123);
// }
// float noise( in vec2 p ) {
//     vec2 i = floor( p );
//     vec2 f = fract( p );  
//   vec2 u = f*f*(3.0-2.0*f);
//     return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
//                      hash( i + vec2(1.0,0.0) ), u.x),
//                 mix( hash( i + vec2(0.0,1.0) ), 
//                      hash( i + vec2(1.0,1.0) ), u.x), u.y);
// }

// // lighting
// float diffuse(vec3 n,vec3 l,float p) {
//     return pow(dot(n,l) * 0.4 + 0.6,p);
// }
// float specular(vec3 n,vec3 l,vec3 e,float s) {    
//     float nrm = (s + 8.0) / (3.1415 * 8.0);
//     return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
// }

// // sky
// vec3 getSkyColor(vec3 e) {
//     e.y = max(e.y,0.0);
//     vec3 ret;
//     ret.x = pow(1.0-e.y,2.0);
//     ret.y = 1.0-e.y;
//     ret.z = 0.6+(1.0-e.y)*0.4;
//     return ret;
// }

// // sea
// float sea_octave(vec2 uv, float choppy) {
//     uv += noise(uv);        
//     vec2 wv = 1.0-abs(sin(uv));
//     vec2 swv = abs(cos(uv));    
//     wv = mix(wv,swv,wv);
//     return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
// }

// float map(vec3 p) {
//     float freq = SEA_FREQ;
//     float amp = SEA_HEIGHT;
//     float choppy = SEA_CHOPPY;
//     vec2 uv = p.xz; uv.x *= 0.75;
  
//     float d, h = 0.0;    
//     for(int i = 0; i < ITER_GEOMETRY; i++) {        
//       d = sea_octave((uv+SEA_TIME)*freq,choppy);
//       d += sea_octave((uv-SEA_TIME)*freq,choppy);
//         h += d * amp;        
//       uv *= octave_m; freq *= 1.9; amp *= 0.22;
//         choppy = mix(choppy,1.0,0.2);
//     }
//     return p.y - h;
// }

// float map_detailed(vec3 p) {
//     float freq = SEA_FREQ;
//     float amp = SEA_HEIGHT;
//     float choppy = SEA_CHOPPY;
//     vec2 uv = p.xz; uv.x *= 0.75;
  
//     float d, h = 0.0;    
//     for(int i = 0; i < ITER_FRAGMENT; i++) {        
//       d = sea_octave((uv+SEA_TIME)*freq,choppy);
//       d += sea_octave((uv-SEA_TIME)*freq,choppy);
//         h += d * amp;        
//       uv *= octave_m; freq *= 1.9; amp *= 0.22;
//         choppy = mix(choppy,1.0,0.2);
//     }
//     return p.y - h;
// }

// vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {  
//     float fresnel = 1.0 - max(dot(n,-eye),0.0);
//     fresnel = pow(fresnel,3.0) * 0.65;
      
//     vec3 reflected = getSkyColor(reflect(eye,n));    
//     vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12; 
  
//     vec3 color = mix(refracted,reflected,fresnel);
  
//     float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
//     color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
  
//     color += vec3(specular(n,l,eye,60.0));
  
//     return color;
// }

// // tracing
// vec3 getNormal(vec3 p, float eps) {
//     vec3 n;
//     n.y = map_detailed(p);    
//     n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
//     n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
//     n.y = eps;
//     return normalize(n);
// }

// float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {  
//     float tm = 0.0;
//     float tx = 1000.0;    
//     float hx = map(ori + dir * tx);
//     if(hx > 0.0) return tx;   
//     float hm = map(ori + dir * tm);    
//     float tmid = 0.0;
//     for(int i = 0; i < NUM_STEPS; i++) {
//         tmid = mix(tm,tx, hm/(hm-hx));                   
//         p = ori + dir * tmid;                   
//       float hmid = map(p);
//     if(hmid < 0.0) {
//           tx = tmid;
//             hx = hmid;
//         } else {
//             tm = tmid;
//             hm = hmid;
//         }
//     }
//     return tmid;
// }

// // main
// void main( void ) {
//   EPSILON_NRM = 0.1 / resolution.x;
//   SEA_TIME = time * SEA_SPEED;

//   vec2 uv = gl_FragCoord.xy / resolution.xy;
//     uv = uv * 2.0 - 1.0;
//     uv.x *= resolution.x / resolution.y;    
//     float time = time * 0.3 + mouse.x*0.01;

//   mouse = vec2(time * 0.1, 0);
      
//     // ray
//     vec3 ang = vec3(3);    
//     vec3 ori = vec3(mouse.x*100.0,3.5,5.0);
//     vec3 dir = normalize(vec3(uv.xy,-2.0));
//   dir.z += length(uv) * 0.15;
//     dir = normalize(dir) * fromEuler(ang);
  
//     // tracing
//     vec3 p;
//     heightMapTracing(ori,dir,p);
//     vec3 dist = p - ori;
//     vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
//     vec3 light = normalize(vec3(0.0,1.0,0.8)); 
           
//     // color
//     vec3 color = mix(
//         getSkyColor(dir),
//         getSeaColor(p,n,light,dir,dist),
//       pow(smoothstep(0.0,-0.05,dir.y),0.3));
      
//     // post
//   gl_FragColor = vec4(pow(color,vec3(0.75)), 1.0);
// }






// 眩晕
// #ifdef GL_ES
// precision mediump float;
// #endif
// //nuclear throne tunnel
// //2017.01.29 tigrou dot ind at gmail dot com
// #extension GL_OES_standard_derivatives : enable

// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;

// vec4 pattern(vec2 pos, float ang) 
// {
//         pos = vec2(pos.x * cos(ang) - pos.y * sin(ang), pos.y * cos(ang) + pos.x * sin(ang)); 
  
//   //if(length(pos) < 0.2)
//   if(abs(pos.x) < 0.2 && abs(pos.y) < 0.2)
//      return vec4(0.0, 0.0, 0.0, 0.0);
//   else if((abs(pos.x) - abs(pos.y)) > 0.0)
//      return vec4(0.59, 0.45, 0.05, 1.0);
//   else
//      return vec4(0.27, 0.07, 0.39, 1.0);      
// }

// void main( void ) 
// {
//   vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.5, 0.5);
//   vec4 color = vec4(0.0);
  
//   for(float i = 0.01 ; i < 1.0 ; i += 0.005)
//   {
//     float o = 1.0 - i;
//     vec2 offset = vec2(o*cos(o*2.0+time)*0.5, o*sin(o*2.0+time)*0.5);
//     vec4 res = pattern(pos/vec2(i*i*2.7)+offset, i*10.0+time);
//     if(res.a > 0.5)
//          color = res*i*2.7;
//   }

//   gl_FragColor = color;
// }

//四叶草
// #ifdef GL_ES
// precision mediump float;
// #endif

// #extension GL_OES_standard_derivatives : enable

// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;

// float leafs = 4.0;
// //from tutorial created by iq
// vec3 computeColor(vec2 p) {
//     float ratio = resolution.x / resolution.y;
//     p.y = p.y / ratio;
//     p /= 0.4;
//     p -= vec2(0.5*ratio, 1.1 / ratio);
//     float r = sqrt(dot(p, p));
//     float a = atan(p.y, p.x) + time * 0.2;
//     float s = 0.5 + 0.5 * sin(leafs * a);
//     float t = 0.15 + 0.35*pow(s, 0.3);
//     t += 0.1 * pow(0.5 + 0.5 * cos(leafs * 2.0 * a), 0.5);
//     float h = r / t;
//     float f = 0.0;
//     if (h < 1.0) {
//         f = 1.0;
//     } else {
//         f = 0.3;
//         h = 2.0;
//     }
    
//     return mix(vec3(1.0), vec3(0.5 * h, 0.5 + 0.5 * h, 0.0), f);
// }

// void main( void )
// {
//     vec2 uv = vec2(gl_FragCoord.x / resolution.x, gl_FragCoord.y  / resolution.y);
//     vec3 res = computeColor(uv);
//     gl_FragColor = vec4(res.rgb,2.0);
// }





//水波
// precision mediump float;

//       uniform float     time;
//       uniform vec2      resolution;
//       uniform vec2      mouse;
// varying vec2 surfacePosition;

//       #define MAX_ITER 5

//       void main( void )
//       {
//           vec2 v_texCoord = gl_FragCoord.xy / resolution;

//           vec2 p =  v_texCoord * 8.0 - vec2(20.0);
//   p = (surfacePosition - vec2(1.5))* 8.0;
//           vec2 i = p;
//           float c = 1.0;
//           float inten = .03;

//           for (int n = 0; n < MAX_ITER; n++)
//           {
//               float t = time * (1.0 - (3.0 / float(n+1)));

//               i = p + vec2(cos(t - i.x) + sin(t + i.y),
//               sin(t - i.y) + cos(t + i.x));
      
//               c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),
//               p.y / (cos(i.y+t)/inten)));
//           }

//           c /= float(MAX_ITER);
//           c = 1.5 - sqrt(c);

//           vec4 texColor = vec4(0.02, 0.15, 0.02, 1.);

//           texColor.rgb *= (1.0 / (1.0 - (c + 0.05)));

//           gl_FragColor = texColor;
//       }







// //变化的树
// #ifdef GL_ES
// precision mediump float;
// #endif

// #extension GL_OES_standard_derivatives : enable

// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;
// varying vec2 surfacePosition;

// void main( void ) {

//   gl_FragColor = vec4( 1.0 );
  
//   vec2 Z = 10.*(surfacePosition-vec2(0.,.09));
//   float width = 1.5;
//   for(float i = 0.; i <= 1.; i += 1./64.){
//     //if(i > mouse.x) return;
//     if(-Z.y - abs(Z.x) > 0. && Z.y > -width) gl_FragColor *= vec4(i*3.,.4+i/1.,0,1);
//     float ph = -sign(Z.x)*3.14159/(4.+8.*(mouse.y-.5));
//     Z += vec2(-sign(Z.x)*width*1.0,0.);
//     Z *= mat2(cos(ph), sin(ph), -sin(ph), cos(ph));
//     width /= sqrt(2.+4.*(mouse.x-.5));
//   }
// }





// //立体的柱子
// #ifdef GL_ES
// precision mediump float;
// #endif

// #extension GL_OES_standard_derivatives : enable

// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;

// float sdBox( vec3 p, vec3 b ) {
//   vec3 d = abs(p) - b;
//   return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
// }

// float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
//   vec3 pa = p - a;
//   vec3 ba = b - a;
//   float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
//   return length(pa - h * ba) - r;
// }

// float sdCappedCylinder( vec3 p, vec2 h ) {
//   vec2 d = abs(vec2(length(p.xz),p.y)) - h;
//   return min(max(d.x,d.y),0.0) + length(max(d,0.0));
// }

// vec3 tri(in vec3 x){return abs(fract(x)-.5);}
// float surfFunc(in vec3 p){
//   return dot(tri(p*0.5 + tri(p*0.25).yzx), vec3(0.666));
// }

// float smin(float a, float b, float k) {
//   float h = clamp((b - a)/k *0.5 + 0.5, 0.0, 1.0);
//   return mix(b, a, h) - k * h * (1.0 - h);
// }

// float hash(vec2 p) {
//   return fract(sin(p.x * 15.57 + p.y * 37.89) * 43758.26);
// }

// float map(vec3 p) {

//   vec3 q = p;
//   q.x *= 1.0 + 0.5 * cos(q.y / 0.8 * 3.141592);
//   float d = sdCappedCylinder(q, vec2(0.4, 0.4));
//   d = max(d, -sdBox(q, vec3(5.0, 0.15, 0.15)));
//   d = min(d, sdBox(p - vec3(0.0, 0.0, -1.0), vec3(1.0, 1.0, 0.01)));
//   d = min(d, sdBox(p - vec3(0.0, -1.0, 0.0), vec3(1.0, 0.01, 1.0)));
//   d = min(d, sdBox(p - vec3(1.0, 0.0, 0.0), vec3(0.01, 1.0, 1.0)));
//   return d;
// }

// vec3 calcNormal(vec3 p) {
//   vec2 e = vec2(-1.0, 1.0) * 0.001;
//   return normalize(
//     e.xyy * map(p + e.xyy) +
//     e.yxy * map(p + e.yxy) +
//     e.yyx * map(p + e.yyx) +
//     e.xxx * map(p + e.xxx)
//   );
// }

// float calcAO(in vec3 ro, in vec3 rd) {
//   float t = 0.0;
//   float h = 0.0;
//   float occ = 0.0;
//   for(int i = 0; i < 5; i++) {
//     t = 0.01 + 0.12*float(i)/4.0;
//     h = map(ro + rd * t);
//     occ += (t-h)*(4.0-float(i));
//   }
//   return clamp(1.0 - 2.0*occ, 0.0, 1.0);
// }

// float softshadow(in vec3 ro, in vec3 rd, in float tmin, in float tmax) {
//   float t = tmin;
//   float h = 0.0;
//   float sh = 1.0;
//   for(int i = 0; i < 20; i++) {
//   if(t > tmax) continue;
//     h = map(ro + rd * t);
//     sh = min(sh, h/t*50.0);
//     t += h * 0.5;
//   }
//   return clamp(sh, 0.0, 1.0);
// }

// float trace(in vec3 ro, in vec3 rd){
//   float FAR = 50.0;
//   float t = 0.0, h;
//   for(int i = 0; i < 72; i++){
//   h = map(ro+rd*t);
//   if(abs(h)<0.002*(t*.125 + 1.) || t>FAR) break;       
//     t += step(h, 1.)*h*.2 + h*.35;
//   }
  
//   return min(t, FAR);
// }

// void main() {
//   vec2 uv = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
  
//   vec3 ro = vec3(-6.0, 3.0, 6.0) + vec3(mouse.x * 2.0 - 1.0, 0.0, 0.0) * 3.0;
//   vec3 ta = vec3(0.0, 0.0, 0.0);
  
//   vec3 cw = normalize(ta - ro);
//   vec3 cup = vec3(0.0, 1.0, 0.0);
//   vec3 cu = normalize(cross(cw, cup));
//   vec3 cv = normalize(cross(cu, cw));
  
//   float pi = 3.141592;
//   float fovy = pi / 4.0;
//   float f = tan(fovy * 0.5);
//   vec3 rd = normalize(cu * uv.x + cv * uv.y + (1.0/f) * cw);
  
//     //-----

//   float e = 0.001;
//   float h = 2.0 * e;
//   float t = trace(ro, rd);
  
//   float ff = clamp((t - 1.0) / 30.0, 0.0, 1.0);
//   ff = exp(-3. * ff);
//   vec3 sky = vec3(0., .9, 2.8);
//   vec3 col = sky;
  
//   vec3 lig_pos0 = vec3(0.0, 1.0, 0.0) * 10.0;
//   vec3 lig_pos1 = vec3(-1.0, 0.0, 0.0) * 10.0;
//   vec3 lig_pos2 = vec3(0.0, 0.0, 1.0) * 10.0;
  
//   float dur = 10.0;
//   float tt = mod(time, dur) / dur;
  
//   vec3 lig_pos = mix(lig_pos0, lig_pos1, smoothstep(0.0, 0.333, tt));
//   lig_pos = mix(lig_pos, lig_pos2, smoothstep(0.333, 0.666, tt));
//   lig_pos = mix(lig_pos, lig_pos0, smoothstep(0.666, 1.0, tt));
//   if(t < 50.0) {
//     vec3 pos = ro + rd * t;
//     vec3 nor = calcNormal(pos);
//     vec3 lig = normalize(lig_pos);
//     float dif = clamp(dot(nor, lig), 0.0, 1.0);
//     vec3 ref = reflect(rd, nor);
//     float spe = pow(clamp(dot(ref, lig), 0.0, 1.0), 64.0);
//     float sh = softshadow(pos, lig, 0.01, 10.0);
//     float fre = 1.0 - dot(nor, -rd);
    
//     col = vec3(1.0) * (dif + spe + fre * 0.5) * sh;
//     col = mix(sky, col, ff);
//   }
  
//   gl_FragColor = vec4(col, 1.0);
// }






// //水泥花朵
// #ifdef GL_ES
// precision mediump float;
// #endif

// #extension GL_OES_standard_derivatives : enable

// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;


// //----------------------------------------------------------------------
// // FlowerTest.glsl
// // original:   https://www.shadertoy.com/view/MltSRf
// // RayMarcher Created by inigo quilez - iq/2013
// // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// //----------------------------------------------------------------------

// float ballFlower (vec3 p)
// { 
//   const float radius = 1.0;
//   float q = length(p);
//   p.y -= 0.4;
// //  p.xz *= 5.4;
//   vec3 n = p; // normalize(p);
//   float rho   = atan(length(vec2(n.x,n.z)),n.y)*20.0 + q*15.0;
//   float theta = atan(n.x,n.z)*9.0 + p.y*5.0+rho;
//   float a = 0.1*(1.2-abs(dot(n,vec3(0,1,0)) ));
//   return q -radius + a*cos(theta) + a*sin(rho - time);
// }
// //----------------------------------------------------------------------

// vec2 map( in vec3 pos )
// {    
//     return vec2( ballFlower(pos),11) ;
// }

// vec2 castRay( in vec3 ro, in vec3 rd )
// {
//     float tmin = 1.0;
//     float tmax = 20.0;
    
// #if 0
//     float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) tmax = min( tmax, tp1 );
//     float tp2 = (1.6-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>1.6 ) tmin = max( tmin, tp2 );
//                                                  else           tmax = min( tmax, tp2 ); }
// #endif
    
//     float precis = 0.002;
//     float t = tmin*0.1;
//     float m = -1.0;
//     for( int i=0; i<215; i++ )
//     {
//         vec2 res = map( ro+rd*t );
//         if( res.x<precis || t>tmax ) break;
//         t += res.x*0.3;
//         m = res.y;
//     }
//     if( t>tmax ) m=-1.0;
//     return vec2( t, m );
// }

// float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
// {
//     float res = 1.0;
//     float t = mint;
//     for( int i=0; i<16; i++ )
//     {
//         float h = map( ro + rd*t ).x;
//         res = min( res, 8.0*h/t );
//         t += clamp( h, 0.02, 0.10 );
//         if( h<0.001 || t>tmax ) break;
//     }
//     return clamp( res, 0.0, 1.0 );
// }

// vec3 calcNormal( in vec3 pos )
// {
//     vec3 eps = vec3( 0.001, 0.0, 0.0 );
//     vec3 nor = vec3( map(pos+eps.xyy).x - map(pos-eps.xyy).x,
//                      map(pos+eps.yxy).x - map(pos-eps.yxy).x,
//                      map(pos+eps.yyx).x - map(pos-eps.yyx).x );
//     return normalize(nor);
// }

// float calcAO( in vec3 pos, in vec3 nor )
// {
//     float occ = 0.0;
//     float sca = 1.0;
//     for( int i=0; i<5; i++ )
//     {
//         float hr = 0.01 + 0.12*float(i)/4.0;
//         vec3 aopos =  nor * hr + pos;
//         float dd = map( aopos ).x;
//         occ += -(dd-hr)*sca;
//         sca *= 0.95;
//     }
//     return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
// }

// vec3 render( in vec3 ro, in vec3 rd )
// { 
//     vec3 col = vec3(0.7, 0.9, 1.0) +rd.y*0.8;
//     vec2 res = castRay(ro,rd);
//     float t = res.x;
//   float m = res.y;
//     if( m > -0.5 )
//     {
//         vec3 pos = ro + t*rd;
//         vec3 nor = calcNormal( pos );
//         vec3 ref = reflect( rd, nor );
        
//         // material        
//         col = 0.45 + 0.3*sin( vec3(0.05,0.08,0.10)*(m-1.0) );
    
//         if( m<1.5 )
//         {
//             float f = mod( floor(5.0*pos.z) + floor(5.0*pos.x), 2.0);
//             col = 0.4 + 0.1*f*vec3(1.0);
//         }

//         // lighting        
//         float occ = calcAO( pos, nor );
//         vec3  lig = normalize( vec3(-0.6, 0.7, -0.5) );
//         float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
//         float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
//         float bac = clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
//         float dom = smoothstep( -0.1, 0.1, ref.y );
//         float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
//         float spe = pow(clamp( dot( ref, lig ), 0.0, 1.0 ),16.0);
        
//         dif *= softshadow( pos, lig, 0.02, 2.5 );
//         dom *= softshadow( pos, ref, 0.02, 2.5 );

//         vec3 lin = vec3(0.0);
//         lin += 1.20*dif*vec3(1.00,0.85,0.55);
//         lin += 1.20*spe*vec3(1.00,0.85,0.55)*dif;
//         lin += 0.20*amb*vec3(0.50,0.70,1.00)*occ;
//         lin += 0.30*dom*vec3(0.50,0.70,1.00)*occ;
//         lin += 0.30*bac*vec3(0.25,0.25,0.25)*occ;
//         lin += 0.40*fre*vec3(1.00,1.00,1.00)*occ;
//         col = col*lin;

//       col = mix( col, vec3(0.8,0.9,1.0), 1.0-exp( -0.002*t*t ) );
//     }
//     return vec3( clamp(col,0.0,1.0) );
// }

// mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
// {
//     vec3 cw = normalize(ta-ro);
//     vec3 cp = vec3(sin(cr), cos(cr),0.0);
//     vec3 cu = normalize( cross(cw,cp) );
//     vec3 cv = normalize( cross(cu,cw) );
//     return mat3( cu, cv, cw );
// }

// void main()
// {
//     vec2 q = gl_FragCoord.xy / resolution.xy;
//     vec2 p = 2.0*q - 1.0;
//     p.x *= resolution.x / resolution.y;
//     vec2 mo =  mouse.xy;
     
//     float time = 15.0 + time;

//     // camera 
//     vec3 ro = vec3( -0.5+3.5*cos(0.1*time + 6.0*mo.x), -0.0 + 4.0*mo.y, 0.5 + 3.5*sin(0.1*time + 6.0*mo.x) );
//     vec3 ta = vec3( -0.5, -0.4, 0.5 );
  
//     // camera-to-world transformation
//     mat3 ca = setCamera( ro, ta, 0.0 );
    
//     // ray direction
//     vec3 rd = ca * normalize( vec3(p.xy,2.0) );

//     // render 
//     vec3 col = render( ro+vec3(1,0,0), rd );

//     col = pow( col, vec3(0.7) );

//     gl_FragColor=vec4( col, 1.0 );
// }






// //电子国度
// #ifdef GL_ES
// precision mediump float;
// #endif
 
// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;
 
// // by srtuss, 2013
// // was trying to find some sort of "mechanical" fractal for texture/heightmap
// // generation, but then i ended up with this.
 
// // rotate position around axis
// vec2 rotate(vec2 p, float a)
// {
//   return vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));
// }
 
// // 1D random numbers
// float rand(float n)
// {
//     return fract(sin(n) * 43758.5453123);
// }
 
// // 2D random numbers
// vec2 rand2(in vec2 p)
// {
//   return fract(vec2(sin(p.x * 1.32 + p.y * 54.077), cos(p.x * 91.32 + p.y * 9.077)));
// }
 
// // 1D noise
// float noise1(float p)
// {
//   float fl = floor(p);
//   float fc = fract(p);
//   return mix(rand(fl), rand(fl + 1.0), fc);
// }
 
// // voronoi distance noise, based on iq's articles
// float voronoi(in vec2 x)
// {
//   vec2 p = floor(x);
//   vec2 f = fract(x);
  
//   vec2 res = vec2(8.0);
//   for(int j = -1; j <= 1; j ++)
//   {
//     for(int i = -1; i <= 1; i ++)
//     {
//       vec2 b = vec2(i, j);
//       vec2 r = vec2(b) - f + rand2(p + b);
      
//       // chebyshev distance, one of many ways to do this
//       float d = max(abs(r.x), abs(r.y));
      
//       if(d < res.x)
//       {
//         res.y = res.x;
//         res.x = d;
//       }
//       else if(d < res.y)
//       {
//         res.y = d;
//       }
//     }
//   }
//   return res.y - res.x;
// }
 
 
// #define flicker (noise1(time * 2.0) * 0.9 + 0.5)
 
// void main(void)
// {
//   vec2 uv = gl_FragCoord.xy / resolution.xy;
//   uv = (uv - 0.5) * 2.0;
//   vec2 suv = uv;
//   uv.x *= resolution.x / resolution.y;
  
  
//   float v = 0.0;
  
//   // that looks highly interesting:
//   //v = 1.0 - length(uv) * 1.3;
  
  
//   // a bit of camera movement
//   uv *= 0.6 + sin(time * 0.1) * 0.1;
//   uv = rotate(uv, sin(time * 0.3) * 1.0);
//   uv += time * 0.4;
  
  
//   // add some noise octaves
//   float a = 0.6, f = 1.0;
  
//   for(int i = 0; i < 3; i ++) // 4 octaves also look nice, its getting a bit slow though
//   { 
//     float v1 = voronoi(uv * f + 1.0);
//     float v2 = 0.0;
    
//     // make the moving electrons-effect for higher octaves
//     if(i > 0)
//     {
//       // of course everything based on voronoi
//       v2 = voronoi(uv * f * 0.5 + 5.0 + time);
      
//       float va = 0.0, vb = 0.0;
//       va = 1.0 - smoothstep(0.0, 0.1, v1);
//       vb = 1.0 - smoothstep(0.0, 0.08, v2);
//       v += a * pow(va * (0.5 + vb), 2.0);
//     }
    
//     // make sharp edges
//     v1 = 1.0 - smoothstep(0.0, 0.3, v1);
    
//     // noise is used as intensity map
//     v2 = a * (noise1(v1 * 5.5 + 0.1));
    
//     // octave 0's intensity changes a bit
//     if(i == 0)
//       v += v2 * flicker;
//     else
//       v += v2;
    
//     f *= 3.0;
//     a *= 0.7;
//   }
 
//   // slight vignetting
//   v *= exp(-0.6 * length(suv)) * 1.2;
  
//   // use texture channel0 for color? why not.
//   //vec3 cexp = texture2D(iChannel0, uv * 0.001).xyz * 3.0 + texture2D(iChannel0, uv * 0.01).xyz;//vec3(1.0, 2.0, 4.0);
  
//   // old blueish color set
//   vec3 cexp = vec3(3.0, 1.0, 3.0);
//     cexp *= 1.3;
 
//   vec3 col = vec3(pow(v, cexp.x), pow(v, cexp.y), pow(v, cexp.z)) * 2.0;
  
//   gl_FragColor = vec4(col, 1.0);
// }






// //红色星云
// #ifdef GL_ES
// precision mediump float;
// #endif
 
 
// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;


// #define iterations 14
// #define formuparam2 (0.3 + 0.7*(abs(2.0*(fract(time*0.002))-1.0)))
 
// #define volsteps 5
// #define stepsize 0.290
 
// #define zoom 0.900
// #define tile   0.850
// #define speed2  0.80
 
// #define brightness 0.003
// #define darkmatter 0.400
// #define distfading 0.560
// #define saturation 0.800


// #define transverseSpeed zoom*2.0
// #define cloud 0.11 

 
// float triangle(float x, float a) { 
//   float output2 = 2.0*abs(  2.0*  ( (x/a) - floor( (x/a) + 0.5) ) ) - 1.0;
//   return output2;
// }
 
// float field(in vec3 p) {  
//   float strength = 7. + .03 * log(1.e-6 + fract(sin(time) * 4373.11));
//   float accum = 0.;
//   float prev = 0.;
//   float tw = 0.;  

//   for (int i = 0; i < 6; ++i) {
//     float mag = dot(p, p);
//     p = abs(p) / mag + vec3(-.5, -.8 + 0.1*sin(time*0.7 + 2.0), -1.1+0.3*cos(time*0.3));
//     float w = exp(-float(i) / 7.);
//     accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
//     tw += w;
//     prev = mag;
//   }
//   return max(0., 5. * accum / tw - .7);
// }



// void main() {   
//       vec2 uv2 =  gl_FragCoord.xy / resolution.xy;
//   vec2 uvs =  uv2 * resolution.xy  / resolution.y;
  
//   float time2 = time;               
//         float speed = speed2;
//         speed = .01 * cos(time2*0.02 + 3.1415926/4.0);          
//   //speed = 0.0;  
//       float formuparam = formuparam2;
  
//       //get coords and direction  
//   vec2 uv = uvs;           
//   //mouse rotation
//   float a_xz = -0.9;
//   float a_yz = .6;
//   float a_xy = -0.9 + time*0.08;  
  
//   mat2 rot_xz = mat2(cos(a_xz),sin(a_xz),-sin(a_xz),cos(a_xz)); 
//   mat2 rot_yz = mat2(cos(a_yz),sin(a_yz),-sin(a_yz),cos(a_yz));   
//   mat2 rot_xy = mat2(cos(a_xy),sin(a_xy),-sin(a_xy),cos(a_xy));
  

//   float v2 =1.0;  
//   vec3 dir=vec3(uv*zoom,1.); 
//   vec3 from=vec3(0.0, 0.0,0.0);                               
//         from.x -= 5.0*(mouse.x-0.5);
//         from.y -= 5.0*(mouse.y-0.5);
               
               
//   vec3 forward = vec3(0.0,-0.0,1.);   
//   from.x += transverseSpeed*(1.0)*cos(0.01*time) + 0.001*time;
//   from.y += transverseSpeed*(1.0)*sin(0.01*time) +0.001*time;
//   from.z += 0.003*time; 
  
//   dir.xy*=rot_xy;
//   forward.xy *= rot_xy;
//   dir.xz*=rot_xz;
//   forward.xz *= rot_xz; 
//   dir.yz*= rot_yz;
//   forward.yz *= rot_yz;
  
//   from.xy*=-rot_xy;
//   from.xz*=rot_xz;
//   from.yz*= rot_yz;
   
  
//   //zoom
//   float zooom = (time2-3311.)*speed;
//   from += forward* zooom;
//   float sampleShift = mod( zooom, stepsize );
   
//   float zoffset = -sampleShift;
//   sampleShift /= stepsize; // make from 0 to 1
  
//   //volumetric rendering
//   float s=0.24;
//   float s3 = s + stepsize/2.0;
//   vec3 v=vec3(0.);
//   float t3 = 0.0; 
  
//   vec3 backCol2 = vec3(0.);
//   for (int r=0; r<volsteps; r++) {
//     vec3 p2=from+(s+zoffset)*dir;// + vec3(0.,0.,zoffset);
//     vec3 p3=from+(s3+zoffset)*dir;// + vec3(0.,0.,zoffset);
    
//     p2 = abs(vec3(tile)-mod(p2,vec3(tile*2.))); // tiling fold
//     p3 = abs(vec3(tile)-mod(p3,vec3(tile*2.))); // tiling fold    
//     #ifdef cloud
//     t3 = field(p3);
//     #endif
    
//     float pa,a=pa=0.;
//     for (int i=0; i<iterations; i++) {
//       p2=abs(p2)/dot(p2,p2)-formuparam; // the magic formula
//       //p=abs(p)/max(dot(p,p),0.005)-formuparam; // another interesting way to reduce noise
//       float D = abs(length(p2)-pa); // absolute sum of average change
//       a += i > 7 ? min( 12., D) : D;
//       pa=length(p2);
//     }
    
    
//     //float dm=max(0.,darkmatter-a*a*.001); //dark matter
//     a*=a*a; // add contrast
//     //if (r>3) fade*=1.-dm; // dark matter, don't render near
//     // brightens stuff up a bit
//     float s1 = s+zoffset;
//     // need closed form expression for this, now that we shift samples
//     float fade = pow(distfading,max(0.,float(r)-sampleShift));    
//     //t3 += fade;   
//     v+=fade;
//           //backCol2 -= fade;

//     // fade out samples as they approach the camera
//     if( r == 0 )
//       fade *= (1. - (sampleShift));
//     // fade in samples as they approach from the distance
//     if( r == volsteps-1 )
//       fade *= sampleShift;
//     v+=vec3(s1,s1*s1,s1*s1*s1*s1)*a*brightness*fade; // coloring based on distance
    
//     backCol2 += mix(.4, 1., v2) * vec3(1.8 * t3 * t3 * t3, 1.4 * t3 * t3, t3) * fade;

    
//     s+=stepsize;
//     s3 += stepsize;   
//   }//фор
           
//   v=mix(vec3(length(v)),v,saturation); //color adjust 

//   vec4 forCol2 = vec4(v*.01,1.);  
//   #ifdef cloud
//   backCol2 *= cloud;
//   #endif  
//   backCol2.b *= -3.8;
//   backCol2.r *= 0.05; 
  
//   backCol2.b = 0.5*mix(backCol2.g, backCol2.b, 0.8);
//   backCol2.g = -0.;
//   backCol2.bg = mix(backCol2.gb, backCol2.bg, 0.5*(cos(time*0.01) + 1.0));  
//   gl_FragColor = forCol2 + vec4(backCol2, 1.0);
// }





// //高级等待 *****
// #ifdef GL_ES
// precision mediump float;
// #endif
// #extension GL_OES_standard_derivatives : enable
// uniform float time;
// uniform vec2 resolution;
// const float INTERVAL = 2.;
// const float PI = 3.14159265358979323844;
// //
// //  r*cos(a) = R + t*(R*cos(b) - R)
// //  r*sin(a) = t*R*sin(b)
// //
// //  t = (r*sin(a))/(R*sin(b))
// //
// //  r*cos(a) = R + (r*sin(a))/(R*sin(b))*(R*cos(b) - R)
// //  r*cos(a) = R + (r*sin(a)/sin(b))*(cos(b) - 1)
// //  r*(cos(a) - (sin(a)/sin(b))*(cos(b) - 1)) = R
// float inside_polygon(vec2 pos, vec2 center, float r, float n, float s)
// {
//         float theta = 2.*PI/n;
//         vec2 d = pos - center;
//         float a = mod(mod(atan(d.y, d.x) + s, 2.*PI), theta);
//         float l = length(d);
//        float m = r*cos(.5*theta)/cos(a - .5*theta); // r/(cos(a) - (sin(a)/sin(theta))*(cos(theta) - 1.));
//        const float border = .001;
//        return smoothstep(m + border, m - border, l);
// }
// float wobble(vec2 pos)
// {
//         vec2 d = pos;
//         float a = (atan(d.y, d.x) + PI/2.)/(2.*PI);
//         float l = .75;
//         float t = mod(time, INTERVAL)/INTERVAL;
//         float o = t*(1. + l);
//         return smoothstep(o, o - l, a);
// }
// float inside_triangle(vec2 pos, vec2 center, float r, float s)
// {
//        return inside_polygon(pos, center, wobble(center)*r, 3., s);
// }
// float inside_triangles(vec2 pos, float r)
// {
//         const float da = 2.*PI/6.;
//         float a = 0.;
//         float v = 0.;
//         for (int i = 0; i < 6; i++) {
//                 float c = cos(a);
//                 float s = sin(a);
//                 vec2 d = vec2(c, s);
//                 vec2 n = vec2(-s, c);
//                 vec2 o0 = (2./3.)*sqrt(3.)*d*r;
//                 vec2 o1 = (5./6.)*sqrt(3.)*d*r;
//                 float r_triangle = 1.*r/sqrt(3.);
//                 v += inside_triangle(pos, o0, r_triangle, a) +
//                       inside_triangle(pos, o1 - n*.5*r, r_triangle, a + PI) +
//                         inside_triangle(pos, o1 + n*.5*r, r_triangle, a + PI);
//                 a += da;
//         }
//         return v;
// }
// void main()
// {
//         const float radius = 20.;
//         vec2 pos = (gl_FragCoord.xy*2. - resolution)/min(resolution.x, resolution.y);
//         float r0 = .25;
//         float r1 = 2.*r0;
//         float r = mix(r1, r0, mod(time, INTERVAL)/INTERVAL);
//         float v = (inside_triangles(pos, r) + inside_polygon(pos, vec2(0., 0.), r, 6., PI/6.));
//         vec4 bg = mix(vec4(1.,.0,1.,1.),vec4(.0,.8,1.,1.),gl_FragCoord.y/resolution.y);
//         vec4 tri = mix(vec4(1.3,.0,1.,1.),vec4(.0,1.3,1.3,1.),gl_FragCoord.y/resolution.y);
//         gl_FragColor = mix(bg, tri, v);
//         //mix(vec4(.5,.1.,1.,1.),vec4(.0,.25,.25,1.),gl_FragCoord.y/resolution.y)
// }





// //旧旧的墙面 *****
// // 00f404afdd835ac3af3602c8943738ea - please mark changes (and/or add docs), and retain this line.

// #ifdef GL_ES
// precision mediump float;
// #endif
 

// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;

// float _MinStep = 0.125;

// //////////////////////////////////////////////////////////////
// // http://www.gamedev.net/topic/502913-fast-computed-noise/
// // replaced costly cos with z^2. fullreset
// vec4 random4 (const vec4 x) {
//     vec4 z = mod(mod(x, vec4(5612.0)), vec4(3.1415927 * 2.0));
//     return fract ((z*z) * vec4(56812.5453));
// }
// const float A = 1.0;
// const float B = 57.0;
// const float C = 113.0;
// const vec3 ABC = vec3(A, B, C);
// const vec4 A3 = vec4(0, B, C, C+B);
// const vec4 A4 = vec4(A, A+B, C+A, C+A+B);
// float cnoise4 (const in vec3 xx) {
//     vec3 x = xx; // mod(xx + 32768.0, 65536.0); // ignore edge issue
//     vec3 fx = fract(x);
//     vec3 ix = x-fx;
//     vec3 wx = fx*fx*(3.0-2.0*fx);
//     float nn = dot(ix, ABC);

//     vec4 N1 = nn + A3;
//     vec4 N2 = nn + A4;
//     vec4 R1 = random4(N1);
//     vec4 R2 = random4(N2);
//     vec4 R = mix(R1, R2, wx.x);
//     float re = mix(mix(R.x, R.y, wx.y), mix(R.z, R.w, wx.y), wx.z);

//     return 1.0 - 2.0 * re;
// }

// //////////////////////////////////////////////////////////////
// // distance functions
// // http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
// float sdSphere( vec3 p, float s ) { return length(p)-s; }
// float udBox( vec3 p, vec3 b ) {  return length(max(abs(p)-b,0.0)); }
// float udRoundBox( vec3 p, vec3 b, float r ) { return length(max(abs(p)-b,0.0))-r; }
// float sdTorus( vec3 p, vec2 t ) { vec2 q = vec2(length(p.xz)-t.x,p.y);  return length(q)-t.y; }
// vec3  opRep(vec3 p, vec3 r) { return mod(p,r)-0.5*r; }
// vec3  opTx(vec3 p, mat4 m ) { return (m*vec4(p,1.0)).xyz; }

// /////////////////////////////////////////////////////
// // the rest

// float fbm(vec3 p) {
//     float f;
//     f = 0.5000*cnoise4( p ); p = p*2.02;
//     f += 0.2500*cnoise4( p ); p = p*2.03;
//     f += 0.1250*cnoise4( p ); p = p*2.01;
//     f += 0.0625*cnoise4( p ); 
//   return f;
// }

// float scene(vec3 p) { 
//   vec3 pw = vec3(0.,0.,10.);
//   float pa = udRoundBox(p+pw,vec3(100.,5,5.),0.22);
//   float pb = udRoundBox(p-pw,vec3(100.,5,5.),0.22);
//   float d = min(pa,pb);
  
//   pa = udRoundBox(p+pw*2.,vec3(100.,80.,.2),0.22);
//   pb = udRoundBox(p-pw*2.,vec3(100.,80.,.2),0.22);
//   d = min(d,min(pa,pb));

//   vec3 c = opRep(p,vec3(20.,4.5,14.))-vec3(0.,0.,7.);
//   d = min(d,udRoundBox(c+pw+vec3(0.,0.0,-3.),vec3(1.75,2.,0.75),0.22));

//   float e = udRoundBox(p-vec3(0.,30.,4.),vec3(100.,0.1,0.1),0.2);
//   e = min(e,udRoundBox(p-vec3(0.,31.,4.),vec3(100.,0.06,0.06),0.1));
//   e = min(e,udRoundBox(p-vec3(0.,5.,1.),vec3(100.,0.1,0.1),0.2));
//   e = min(e,udRoundBox(p-vec3(0.,4.,1.),vec3(100.,0.1,0.1),0.2)); 
//   e = min(e,udRoundBox(p-vec3(7.45,0.,-7.5),vec3(0.1,100.,0.1),0.1)); 

//   float n = fbm(p);   
//   return min(e,n*0.32+d); // 'texture'
// }

// vec4 color(float d) { 
//   return mix(vec4(1.,1.,1.,0.25),vec4(0.2,0.1,0.,0.05),smoothstep(0.,0.1,d)); 
// }

// vec4 ray(vec3 pos, vec3 step) {
//     vec4 sum = vec4(0.);
//     vec4 col;
//     float d = 9999.0;
// #define RAY1  { d = scene(pos); col = color(d); col.rgb *= col.a; sum += col*(1.0 - sum.a); pos += step*max(d,_MinStep); }
// #define RAY4  RAY1 RAY1 RAY1 RAY1
//     RAY4 RAY4 RAY4 RAY4
//     return sum;
// }

// void main( void ) {
//   vec3 e = vec3(sin(time*0.2)*20.,14.,-20.); 
//   vec3 p = vec3((gl_FragCoord.xy / resolution.xy) * 2. -1., 1.);
//   p.x *= resolution.x/resolution.y;
//   p += e;
//   gl_FragColor = ray(p, normalize(p-e));
// }











// 淡彩色线条
// #ifdef GL_ES
// precision mediump float;
// #endif

// uniform vec2 resolution;
// uniform float time;

// float d2y(float d){ d*= 40.; return 1./(d*d);}

// vec3 hsv2rgb(vec3 c)
// {
//     vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//     vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//     return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
// }

// float gauss(float s, float x){
//     return (0.85)*exp(-x*x/(2.*s*s));
// }
// #if 1
// float blur(float dist, float width, float blur, float intens){
//     float w = width;
//     float e = 0.85*blur;
//     dist*=0.75;
//     float b = smoothstep(-w-e, -w+e, dist)-smoothstep(w-e, w+e, dist);
//     return 1.0*pow(b,1.9)*(1.+80.*blur)*intens;
//     //return 0.9*b*intens;
// }
// #else
// float blur(float dist, float width, float blur, float intens){
//     float w = width;
//     dist = max(abs(dist)-width,0.);
//     float b = gauss(0.02+w*10.*blur,dist);
//     return b*intens;
// }
// #endif
// float d2y2(float d, float i){
//     float b = 0.04*i+0.0001;
//     return blur(d , 0.03, b, 0.4);
// }



// float f(float x){
//     return blur(0.5*x, 0.03, 0.04+0.5, 1.);
// }


// #define N 8
// // hauteur de la vague
// float wave(float x, int i){
//     float i_f=float(i);
//     float fy = (3.3-0.5*i_f)*sin(x*2.+2.8*time+.6*i_f);
//     return fy * (0.4+0.3*cos(x));
// }

// void main(void)
// {
//     vec2 uv = (gl_FragCoord.xy / resolution - vec2(0.5)) * vec2(resolution.x / resolution.y, 1.0) * 1.0;
//     uv.y *= 2.2;
//     uv.x *= 2.1;

  
//     float yf = 0.*d2y(distance(uv.y*2., f(uv.x)));
//     vec3 col = vec3(0.0);
//     for(int i = 0; i<N; ++i){
//         float i_f = float(i)*0.8+1.;
//         float y = d2y2(distance(3.*uv.y, wave(uv.x, i)),i_f);
//         col += 0.8*y *hsv2rgb(vec3(0.00015*time+i_f*0.1-0.05, 0.6,1.0));
        
//     }
    
//     gl_FragColor = vec4(vec3(yf)+(233./255.)-col, 1.0);
// }










//卡通云 *****
// ----------------------------------------------------------------------------------------
//  "Toon Cloud" by Antoine Clappier - March 2015
//
//  Licensed under:
//  A Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
//  http://creativecommons.org/licenses/by-nc-sa/4.0/
// ----------------------------------------------------------------------------------------
// original from https://www.shadertoy.com/view/4t23RR
// ----------------------------------------------------------------------------------------

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

#define TAU 6.28318530718


const vec3 BackColor  = vec3(0.0, 0.4, 0.58);
const vec3 CloudColor = vec3(0.18,0.70,0.87);


float Func(float pX)
{
  return 0.6*(0.5*sin(0.1*pX) + 0.5*sin(0.553*pX) + 0.7*sin(1.2*pX));
}


float FuncR(float pX)
{
  return 0.5 + 0.25*(1.0 + sin(mod(40.0*pX, TAU)));
}


float Layer(vec2 pQ, float pT)
{
  vec2 Qt = 3.5*pQ;
  pT *= 0.5;
  Qt.x += pT;

  float Xi = floor(Qt.x);
  float Xf = Qt.x - Xi -0.5;

  vec2 C;
  float Yi;
  float D = 1.0 - step(Qt.y,  Func(Qt.x));

  // Disk:
  Yi = Func(Xi + 0.5);
  C = vec2(Xf, Qt.y - Yi ); 
  D =  min(D, length(C) - FuncR(Xi+ pT/80.0));

  // Previous disk:
  Yi = Func(Xi+1.0 + 0.5);
  C = vec2(Xf-1.0, Qt.y - Yi ); 
  D =  min(D, length(C) - FuncR(Xi+1.0+ pT/80.0));

  // Next Disk:
  Yi = Func(Xi-1.0 + 0.5);
  C = vec2(Xf+1.0, Qt.y - Yi ); 
  D =  min(D, length(C) - FuncR(Xi-1.0+ pT/80.0));

  return min(1.0, D);
}

void main(void){
  vec2 uv = 1.2*(2.0*gl_FragCoord.xy - resolution.xy) / resolution.y;
  
  // Render:
  vec3 Color= BackColor;

  for(float J=0.0; J<=1.0; J+=0.2)
  {
    // Cloud Layer: 
    float Lt =  time*(0.5  + 2.0*J)*(1.0 + 0.1*sin(226.0*J)) + 17.0*J;
    vec2 Lp = vec2(0.0, 0.3+1.5*( J - 0.5));
    float L = Layer(uv + Lp, Lt);

    // Blur and color:
    float Blur = 4.0*(0.5*abs(2.0 - 5.0*J))/(11.0 - 5.0*J);

    float V = mix( 0.0, 1.0, 1.0 - smoothstep( 0.0, 0.01 +0.2*Blur, L ) );
    vec3 Lc=  mix( CloudColor, vec3(1.0), J);

    Color =mix(Color, Lc,  V);
  }
  gl_FragColor = vec4(Color,1.);
}






// // Colorful Voronoi
// // By: Brandon Fogerty
// // bfogerty at gmail dot com
// // xdpixel.com

// #ifdef GL_ES
// precision mediump float;
// #endif

// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;

// vec2 hash(vec2 p)
// {
//     mat2 m = mat2(  13.85, 47.77,
//                     99.41, 88.48
//                 );

//     return fract(sin(m*p) * 46738.29);
// }

// float voronoi(vec2 p)
// {
//     vec2 g = floor(p);
//     vec2 f = fract(p);

//     float distanceToClosestFeaturePoint = 1.0;
//     for(int y = -1; y <= 1; y++)
//     {
//         for(int x = -1; x <= 1; x++)
//         {
//             vec2 latticePoint = vec2(x, y);
//             float currentDistance = distance(latticePoint + hash(g+latticePoint), f);
//             distanceToClosestFeaturePoint = min(distanceToClosestFeaturePoint, currentDistance);
//         }
//     }

//     return distanceToClosestFeaturePoint;
// }

// void main( void )
// {
//     vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
//     uv.x *= resolution.x / resolution.y;

//     float offset = voronoi(uv*10.0 + vec2(time));
//     float t = 1.0/abs(((uv.x + sin(uv.y + time)) + offset) * 30.0);

//     float r = voronoi( uv * 1.0 ) * 10.0;
//     vec3 finalColor = vec3(10.0 * uv.y, 2.0, 1.0 * r) * t;
    
//     gl_FragColor = vec4(finalColor, 1.0 );
// }

// //小花 *****
// #ifdef GL_ES
// precision mediump float;
// #endif

// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;

// #define pi 3.1415926535897932384626433832795
// #define flyCount 30.


// float testFuncFloor(float v){

//     const float amplitude=1.;
//     const float t=pi*2.;
//     float k=4.*amplitude/t;
//     float r=mod( v  ,t);
//     float d=floor(v /(.5* t) );
    
//   return mix(k* r-amplitude ,  amplitude*3.-k* r ,mod(d,2.)  );
// }

// float getRad(vec2 q){
//    return atan(q.y,q.x); 
// }

// vec2 noise(vec2 tc){
//     //return (2.*texture2D(iChannel0, tc).xy-1.).xy;
//     return vec2(fract(sin(tc.x) ),fract(sin(tc.y) ) );
// }

// float firefly(vec2 p,float size){
    
//   //return smoothstep(0.,size,dot(p,p)*200. );
//   return smoothstep(0.,size,length(p) );

// }

// const float pow=1.;
// const float flySpeed=0.1;


// void main( void ) {

//     float pow=1.;
//     const float duration=1.;
//     float t=duration*(1.+sin(3.* time ) );
//   vec2 p= gl_FragCoord.xy / resolution.xy;
   
//   float ratio= resolution.y/resolution.x;
    
//      vec2 uv=p;
//     uv.y*=ratio;
    
    
//     vec2 flowerP=vec2(.618,0.518);
//     vec2 q=p-flowerP-vec2( pow*.008*cos(3.*time) ,pow*.008*sin(3.*time) ) ;
//     vec2 rootP=p-+flowerP-vec2( pow*.02*cos(3.*time)*p.y ,-0.48+pow*.008*sin(3.*time) );
   
//   q.y*=ratio;
  
//     //sky
//     vec3 col=mix( vec3(0.1,0.6,0.5), vec3(0.2,0.1,0.2), sqrt(p.y)*.6 );
    

//     //draw stem 
//     float width=0.01;
//     float h=.5;
//     float w=.0005;
//     col=mix(vec3(.5,.7,.4),col, 1.- (1.- smoothstep(h,h+width, abs(rootP.y ) )  ) * (1.- smoothstep(w,w+width, abs(rootP.x-0.1*sin(4.*rootP.y+pi*.35) ) )  ) );
    
//     //draw flower 
//     vec3 flowerCol=mix(vec3(.7,.7,.2),vec3(.7,.9,.7), smoothstep( .0,1.,length(q)*10. ) ) ;

//     const float edge=.02;
//     float r= .1+0.05*( testFuncFloor( getRad( q ) *7.  + 2.*q.x*(t-duration)  )  );

//   col=mix(flowerCol,col, smoothstep(r,r+edge,  length( q )  ) );
    
//   //draw buds
//     float r1=0.;
//     r1=.04;
//     vec3 budCol=mix (vec3(.3,.4,0.),vec3(.9,.8,0.), length(q)*10. );
//   col=mix(budCol,col, smoothstep(r1,r1+0.01,  length( q )  ) );
    
//     //draw firefly
//   //vec3 flyCol=mix (vec3(.1,.4,0.1),vec3(.1,1.,1.), length(q)*10. );
  
//     for (float i=0.;i<flyCount;i++){
    
//         float seed=i/flyCount;
//   float seed2=fract(i/flyCount*5.);
//         float t1=1.*(1.+sin(noise(vec2(seed) ).x* time ) );
//       vec2 fireflyP=uv- 
//         vec2(noise(vec2(seed2) ).x+noise(vec2(seed2) ).x*t1*flySpeed,
//        noise(vec2(seed) ).y+noise(vec2(seed) ).y*t1*flySpeed);
      
//     float fly= firefly( fireflyP,.002+.008*seed );
//       vec3 flyCol=mix(vec3(0.1,0.9,0.1)*t1,vec3(0.), fly );
//       col+=flyCol;
//     }
  
//     gl_FragColor=vec4(col,0.);
//   /*
//   vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

//   float color = 0.0;
//   color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
//   color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
//   color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
//   color *= sin( time / 10.0 ) * 0.5;

//   gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
//   */
// }