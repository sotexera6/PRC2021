<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl"
    exclude-result-prefixes="xd"
    version="1.0">

    <xsl:output method="text" encoding="UTF-8" indent="yes"/>

    <xsl:template match="//inproceedings">
        ###  http://www.di.uminho.pt/prc2021/pubs#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Inproceedings ;
        <xsl:apply-templates mode="info" select="."/>
    </xsl:template>

    <xsl:template match="//proceedings">
        ###  http://www.di.uminho.pt/prc2021/pubs#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Proceedings ;
        <xsl:apply-templates mode="info" select="."/>
    </xsl:template>

    <xsl:template match="//book">
        ###  http://www.di.uminho.pt/prc2021/pubs#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Book ;
        <xsl:apply-templates mode="info" select="."/>
    </xsl:template>

    <xsl:template match="//inbook">
        ###  http://www.di.uminho.pt/prc2021/pubs#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Inbook ;
        <xsl:apply-templates mode="info" select="."/>
    </xsl:template>

    <xsl:template match="//article">
        ###  http://www.di.uminho.pt/prc2021/pubs#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Article ;
        <xsl:apply-templates mode="info" select="."/>
    </xsl:template>

    <xsl:template match="//phdthesis">
        ###  http://www.di.uminho.pt/prc2021/pubs#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Phdthesis ;
        <xsl:apply-templates mode="info" select="."/>
    </xsl:template>

    <xsl:template match="//masterthesis">
        ###  http://www.di.uminho.pt/prc2021/pubs#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Masterthesis ;
        <xsl:apply-templates mode="info" select="."/>
    </xsl:template>

    <xsl:template match="//misc">
        ###  http://www.di.uminho.pt/prc2021/pubs#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Misc ;
        <xsl:apply-templates mode="info" select="."/>
    </xsl:template>

    <xsl:template match="." mode="info">
        <xsl:for-each select="author">:hasAuthor :<xsl:value-of select="@id"/> ;
        </xsl:for-each>
        <xsl:for-each select="author-ref">:hasAuthorRef :<xsl:value-of select="@authorid"/> ;
        </xsl:for-each>
        <xsl:for-each select="editor">:editedBy :<xsl:value-of select="@id"/> ;
        </xsl:for-each>
        <xsl:for-each select="editor-ref">:hasEditorRef :<xsl:value-of select="@authorid"/> ;
        </xsl:for-each>
        <xsl:if test="title">:title "<xsl:value-of select="translate(title, ' ','_')"/>"</xsl:if>
        <xsl:if test="booktitle"> ;
        :booktitle "<xsl:value-of select="translate(booktitle, ' ','_')"/>"</xsl:if>
        <xsl:if test="school"> ;
        :school "<xsl:value-of select="translate(school, ' ','_')"/>"</xsl:if>
        <xsl:if test="journal"> ;
        :journal "<xsl:value-of select="translate(journal, ' ','_')"/>"</xsl:if>
        <xsl:if test="publisher"> ;
        :publisher "<xsl:value-of select="translate(publisher, ' ','_')"/>"</xsl:if>
        <xsl:if test="howpublished"> ;
        :howpublished "<xsl:value-of select="translate(howpublished, ' ','_')"/>"</xsl:if>
        <xsl:if test="volume"> ;
        :volume "<xsl:value-of select="translate(volume, ' ','_')"/>"</xsl:if>
        <xsl:if test="chapter"> ;
        :chapter "<xsl:value-of select="translate(chapter, ' ','_')"/>"</xsl:if>
        <xsl:if test="pages"> ;
        :pages "<xsl:value-of select="translate(pages, ' ','_')"/>"</xsl:if>
        <xsl:if test="number"> ;
        :number "<xsl:value-of select="translate(number, ' ','_')"/>"</xsl:if>
        <xsl:if test="address"> ;
        :address "<xsl:value-of select="translate(address, ' ','_')"/>"</xsl:if>
        <xsl:if test="year"> ;
        :year "<xsl:value-of select="year"/>"</xsl:if>
        <xsl:if test="month"> ;
        :month "<xsl:value-of select="month"/>"</xsl:if>
        <xsl:if test="doi"> ;
        :doi "<xsl:value-of select="translate(doi, ' ','_')"/>"</xsl:if>
        <xsl:if test="isbn"> ;
        :isbn "<xsl:value-of select="translate(isbn, ' ','_')"/>"</xsl:if>
        <xsl:if test="issn"> ;
        :issn "<xsl:value-of select="translate(issn, ' ','_')"/>"</xsl:if>
        <xsl:if test="deliverables/pdf"> ;
        :pdf "<xsl:value-of select="deliverables/pdf/@url"/>"</xsl:if> 
        <xsl:if test="uri"> ;
        :uri "<xsl:value-of select="translate(uri, ' ','_')"/>"</xsl:if> .
        
        # ----------------------------------------
        <xsl:for-each select="author">
        ###  http://www.di.uminho.pt/prc2021/pubs#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Author ;
        :name "<xsl:value-of select="translate(node(), ' ','_')"/>" .
        
        # ----------------------------------------
        </xsl:for-each>
        <xsl:for-each select="editor">
        ###  http://www.di.uminho.pt/prc2021/pubs#<xsl:value-of select="@id"/>
        :<xsl:value-of select="@id"/> rdf:type owl:NamedIndividual ,
        :Editor ;
        :name "<xsl:value-of select="translate(node(), ' ','_')"/>" .
        
        # ----------------------------------------
        </xsl:for-each>

    </xsl:template>


</xsl:stylesheet>

