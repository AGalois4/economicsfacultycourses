#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Dec  2 13:08:55 2022

@author: armandorg
"""

import numpy as np
import matplotlib.pyplot as plt

E=np.array([(0,0,1),(3,0,1),(3,1,1),(1,1,1),(1,2,1),(2,2,1),
            (2,3,1),(1,3,1),(1,4,1),(3,4,1),(3,5,1),(0,5,1),(0,0,1)])

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
plt.plot(E[:,0],E[:,1],E[:,2],color="blue") # Gráfica de E

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

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
plt.plot(E[:,0],E[:,1],color="blue") # Gráfica de E
plt.plot(E_Rx[:,0],E_Rx[:,1],color="orange") # Gráfica de E reflejada eje x
plt.plot(E_Ry[:,0],E_Ry[:,1],color="red") # Gráfica de E reflejada eje x
plt.plot(E_Ro[:,0],E_Ro[:,1],color="green") # Gráfica de E reflejada eje x

# MATRIZ DE ROTACIÓN
angulo=np.pi/3 # angulo de rotación
Rot=np.array([( np.cos(angulo),np.sin(angulo),0),
              (-np.sin(angulo),np.cos(angulo),0),
              (              0,             0,1)])
E_Rot=np.dot(E,Rot) # Rotamos E al posmultiplicarla por Rot

plt.plot(E[:,0],E[:,1],color="blue") # Gráfica de E
plt.plot(E_Rot[:,0],E_Rot[:,1],color="red") # Gráfica de E rotada pi/3


















