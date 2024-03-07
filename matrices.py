#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Dec  2 13:08:55 2022

@author: armandorg
"""

import numpy as np
import matplotlib.pyplot as plt


###############################################################################
# GRÁFICA LETRA
E=np.array([(0,0,1),(3,0,1),(3,1,1),(1,1,1),(1,2,1),(2,2,1),
            (2,3,1),(1,3,1),(1,4,1),(3,4,1),(3,5,1),(0,5,1),(0,0,1)])

# fig = plt.figure()
# ax = fig.add_subplot(111, projection='3d')
plt.plot(E[:,0],E[:,1],color="blue") # Gráfica de E, agregar (,E[:,2]) para 3D
 
###############################################################################

# MATRICES DE REFLEXIÓN
Rx=np.array([(1, 0,0),
             (0,-1,0),
             (0, 0,1)])
Ry=np.array([(-1,0,0),
             ( 0,1,0),
             ( 0,0,1)])
Ro=np.array([(-1, 0,0),
             ( 0,-1,0),
             ( 0, 0,1)])
E_Rx=np.dot(E,Rx) # refleja E con respecto al eje x
E_Ry=np.dot(E,Ry) # refleja E con respecto al eje y
E_Ro=np.dot(E,Ro) # refleja E con respecto al origen

#fig = plt.figure()
# ax = fig.add_subplot(111, projection='3d')
plt.plot(E[:,0],E[:,1],color="blue") # Gráfica de E
plt.plot(E_Rx[:,0],E_Rx[:,1],color="orange") # Gráfica de E reflejada eje x
plt.plot(E_Ry[:,0],E_Ry[:,1],color="red") # Gráfica de E reflejada eje x
plt.plot(E_Ro[:,0],E_Ro[:,1],color="green") # Gráfica de E reflejada eje x

###############################################################################

# MATRIZ DE ROTACIÓN
angulo=np.pi/3 # angulo de rotación
Rot=np.array([( np.cos(angulo),np.sin(angulo),0),
              (-np.sin(angulo),np.cos(angulo),0),
              (              0,             0,1)])
E_Rot=np.dot(E,Rot) # Rotamos E al posmultiplicarla por Rot

plt.plot(E[:,0],E[:,1],color="blue") # Gráfica de E
plt.plot(E_Rot[:,0],E_Rot[:,1],color="red") # Gráfica de E rotada pi/3

###############################################################################

# MATRIZ DE CAMBIO DE ESCALA
s=2 # Cuando aumenta la escala
S=np.array([[s,0,0.],
            [0,s,0],
            [0,0,1]])
E_CE=np.dot(E,S)

plt.plot(E[:,0],E[:,1],color="blue") # Gráfica de E
plt.plot(E_CE[:,0],E_CE[:,1],color="red") # Gráfica ampliada al doble (s=2)

###############################################################################

# MATRIZ DE DEFORMACIÓN HORIZONTAL/VERTICAL
h=0;v=-1
D=np.array([[1.,h,0],
            [v ,1,0],
            [0 ,0,1]])
E_D=np.dot(E,D)

plt.plot(E[:,0],E[:,1],color="blue") # Gráfica de E
plt.plot(E_D[:,0],E_D[:,1],color="red") # Gráfica de E deformada

###############################################################################

# MATRIZ DE TRASLACIÓN
TX=-4;TY=-2
T=np.array([[ 1, 0,0 ],
            [ 0, 1,0 ],
            [TX,TY,1.]])
E_T=np.dot(E,T)

plt.plot(E[:,0],E[:,1],color="blue") # Gráfica de E
plt.plot(E_T[:,0],E_T[:,1],color="red") # Gráfica de E trasladada

###############################################################################

# MATRIZ DE TRASLACIÓN
TX=-4;TY=-2
T=np.array([[ 1, 0,0 ],
            [ 0, 1,0 ],
            [TX,TY,1.]])
E_T=np.dot(E,T)

plt.plot(E[:,0],E[:,1],color="blue") # Gráfica de E
plt.plot(E_T[:,0],E_T[:,1],color="red") # Gráfica de E trasladada














